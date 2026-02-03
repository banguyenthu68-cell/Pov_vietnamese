import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// GET /api/courses/[id]/lessons/[lessonId] - Get lesson details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; lessonId: string } }
) {
  try {
    const session = await getServerSession()
    const userId = session?.user?.id

    // Check if user is enrolled in the course
    const enrollment = userId ? await prisma.enrollment.findFirst({
      where: {
        userId: userId,
        courseId: params.id
      }
    }) : null

    const lesson = await prisma.lesson.findUnique({
      where: { id: params.lessonId },
      include: {
        progress: userId ? {
          where: {
            userId: userId
          }
        } : false
      }
    })

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Check access permissions
    if (!lesson.isFree && !enrollment) {
      return NextResponse.json(
        { error: 'You must be enrolled to access this lesson' },
        { status: 403 }
      )
    }

    const response = {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl,
      duration: lesson.duration,
      transcript: lesson.transcript,
      resources: lesson.resources || [],
      notes: lesson.notes,
      isCompleted: lesson.progress && lesson.progress.length > 0 ? lesson.progress[0].isCompleted : false
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching lesson:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    )
  }
}
