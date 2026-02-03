import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// GET /api/courses/[id] - Get course details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    const userId = session?.user?.id

    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                progress: userId ? {
                  where: {
                    userId: userId
                  }
                } : false
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        },
        enrollments: userId ? {
          where: {
            userId: userId
          }
        } : false
      }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    const isEnrolled = userId && course.enrollments && course.enrollments.length > 0

    // Transform modules and lessons
    const modules = course.modules.map(module => ({
      id: module.id,
      title: module.title,
      description: module.description,
      lessons: module.lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        duration: lesson.duration,
        isCompleted: lesson.progress && lesson.progress.length > 0 ? lesson.progress[0].isCompleted : false,
        isFree: lesson.isFree,
        videoUrl: isEnrolled || lesson.isFree ? lesson.videoUrl : undefined
      }))
    }))

    const lessonsCount = modules.reduce((acc, module) => acc + module.lessons.length, 0)

    const response = {
      id: course.id,
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      instructorBio: course.instructorBio,
      thumbnail: course.thumbnail,
      price: course.price,
      duration: course.duration,
      studentCount: course.studentCount || 0,
      rating: course.rating || 4.5,
      level: course.level,
      lessonsCount,
      isEnrolled: !!isEnrolled,
      category: course.category,
      modules,
      whatYouWillLearn: course.whatYouWillLearn || [],
      requirements: course.requirements || []
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}

// PUT /api/courses/[id] - Update course (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // TODO: Check if user is admin

    const body = await request.json()
    const {
      title,
      description,
      instructor,
      instructorBio,
      price,
      duration,
      level,
      category,
      thumbnail,
      whatYouWillLearn,
      requirements,
      isPublished
    } = body

    const course = await prisma.course.update({
      where: { id: params.id },
      data: {
        title,
        description,
        instructor,
        instructorBio,
        price,
        duration,
        level,
        category,
        thumbnail,
        whatYouWillLearn,
        requirements,
        isPublished
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    )
  }
}

// DELETE /api/courses/[id] - Delete course (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // TODO: Check if user is admin

    await prisma.course.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    )
  }
}
