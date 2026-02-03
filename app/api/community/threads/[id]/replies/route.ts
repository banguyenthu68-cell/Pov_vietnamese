import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// POST /api/community/threads/[id]/replies - Add a reply to a thread
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Check if thread exists and is not locked
    const thread = await prisma.communityThread.findUnique({
      where: { id: params.id }
    })

    if (!thread) {
      return NextResponse.json(
        { error: 'Thread not found' },
        { status: 404 }
      )
    }

    if (thread.isLocked) {
      return NextResponse.json(
        { error: 'Thread is locked' },
        { status: 403 }
      )
    }

    const reply = await prisma.communityReply.create({
      data: {
        content,
        authorId: session.user.id,
        threadId: params.id
      },
      include: {
        author: {
          select: {
            name: true,
            image: true
          }
        }
      }
    })

    // Update thread's lastActivity
    await prisma.communityThread.update({
      where: { id: params.id },
      data: {
        lastActivity: new Date()
      }
    })

    return NextResponse.json({
      id: reply.id,
      content: reply.content,
      author: reply.author.name || 'Anonymous',
      authorAvatar: reply.author.image,
      createdAt: reply.createdAt.toISOString(),
      likes: 0,
      isLiked: false
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating reply:', error)
    return NextResponse.json(
      { error: 'Failed to create reply' },
      { status: 500 }
    )
  }
}
