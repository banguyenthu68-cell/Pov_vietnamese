import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// POST /api/courses/[id]/lessons/[lessonId]/complete - Mark lesson as completed
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; lessonId: string } }
) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Check if user is enrolled
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: userId,
        courseId: params.id
      }
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: 'You must be enrolled to mark lessons as complete' },
        { status: 403 }
      )
    }

    // Create or update lesson progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: userId,
          lessonId: params.lessonId
        }
      },
      update: {
        isCompleted: true,
        completedAt: new Date()
      },
      create: {
        userId: userId,
        lessonId: params.lessonId,
        isCompleted: true,
        completedAt: new Date()
      }
    })

    // Update enrollment progress
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        modules: {
          include: {
            lessons: true
          }
        }
      }
    })

    if (course) {
      const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0)
      const completedLessons = await prisma.lessonProgress.count({
        where: {
          userId: userId,
          lesson: {
            module: {
              courseId: params.id
            }
          },
          isCompleted: true
        }
      })

      const progressPercentage = Math.round((completedLessons / totalLessons) * 100)

      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
          progress: progressPercentage
        }
      })
    }

    return NextResponse.json({ success: true, progress })
  } catch (error) {
    console.error('Error marking lesson as complete:', error)
    return NextResponse.json(
      { error: 'Failed to mark lesson as complete' },
      { status: 500 }
    )
  }
}
