import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// GET /api/courses - List all courses
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    const userId = session?.user?.id

    // Check if this is an admin request (show all courses including drafts)
    const { searchParams } = new URL(request.url)
    const showAll = searchParams.get('all') === 'true'

    // Get all courses with enrollment status
    const courses = await prisma.course.findMany({
      where: showAll ? {} : {
        isPublished: true
      },
      include: {
        modules: {
          include: {
            lessons: true
          }
        },
        enrollments: userId ? {
          where: {
            userId: userId
          }
        } : false
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform data for response
    const coursesWithStats = courses.map(course => {
      const lessonsCount = course.modules.reduce((acc, module) => acc + module.lessons.length, 0)
      const isEnrolled = userId && course.enrollments && course.enrollments.length > 0

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        instructor: course.instructor,
        thumbnail: course.thumbnail,
        price: course.price,
        duration: course.duration,
        studentCount: course.studentCount || 0,
        rating: course.rating || 4.5,
        level: course.level,
        lessonsCount,
        isEnrolled: !!isEnrolled,
        category: course.category
      }
    })

    return NextResponse.json(coursesWithStats)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

// POST /api/courses - Create a new course (admin only)
export async function POST(request: NextRequest) {
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
      name, // alias for title
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
      isPublished,
      modules
    } = body

    // Create course with modules and lessons
    const course = await prisma.course.create({
      data: {
        title: title || name,
        description,
        instructor: instructor || 'POV Vietnamese',
        instructorBio: instructorBio || 'Experienced Vietnamese language teacher',
        price,
        duration: duration || '8 weeks',
        level,
        category: category || 'Language Learning',
        thumbnail,
        whatYouWillLearn: whatYouWillLearn || [],
        requirements: requirements || [],
        isPublished: isPublished || false,
        studentCount: 0,
        rating: 0,
        modules: modules ? {
          create: modules.map((module: any, moduleIndex: number) => ({
            title: module.title,
            description: module.description || '',
            order: module.order || moduleIndex + 1,
            lessons: {
              create: (module.lessons || []).map((lesson: any, lessonIndex: number) => ({
                title: lesson.title,
                description: lesson.description || '',
                videoUrl: lesson.videoUrl || null,
                duration: lesson.duration ? `${lesson.duration} minutes` : '0 minutes',
                order: lesson.order || lessonIndex + 1,
                isFree: lesson.isFree || false
              }))
            }
          }))
        } : undefined
      },
      include: {
        modules: {
          include: {
            lessons: true
          }
        }
      }
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}
