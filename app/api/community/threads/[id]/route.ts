import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// GET /api/community/threads/[id] - Get thread details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    const userId = session?.user?.id

    // Increment view count
    await prisma.communityThread.update({
      where: { id: params.id },
      data: {
        viewCount: {
          increment: 1
        }
      }
    })

    const thread = await prisma.communityThread.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            name: true,
            image: true
          }
        },
        replies: {
          include: {
            author: {
              select: {
                name: true,
                image: true
              }
            },
            likes: userId ? {
              where: {
                userId: userId
              }
            } : false,
            _count: {
              select: {
                likes: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        _count: {
          select: {
            replies: true
          }
        }
      }
    })

    if (!thread) {
      return NextResponse.json(
        { error: 'Thread not found' },
        { status: 404 }
      )
    }

    const response = {
      id: thread.id,
      title: thread.title,
      content: thread.content,
      author: thread.author.name || 'Anonymous',
      authorAvatar: thread.author.image,
      category: thread.category,
      isPinned: thread.isPinned,
      isLocked: thread.isLocked,
      replyCount: thread._count.replies,
      viewCount: thread.viewCount,
      createdAt: thread.createdAt.toISOString(),
      replies: thread.replies.map(reply => ({
        id: reply.id,
        content: reply.content,
        author: reply.author.name || 'Anonymous',
        authorAvatar: reply.author.image,
        createdAt: reply.createdAt.toISOString(),
        likes: reply._count.likes,
        isLiked: userId && reply.likes && reply.likes.length > 0
      }))
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching thread:', error)
    return NextResponse.json(
      { error: 'Failed to fetch thread' },
      { status: 500 }
    )
  }
}

// PUT /api/community/threads/[id] - Update thread (author or admin only)
export async function PUT(
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
    const { title, content, isPinned, isLocked } = body

    // Check ownership or admin status
    const thread = await prisma.communityThread.findUnique({
      where: { id: params.id }
    })

    if (!thread) {
      return NextResponse.json(
        { error: 'Thread not found' },
        { status: 404 }
      )
    }

    // TODO: Check if user is admin for isPinned/isLocked

    const updatedThread = await prisma.communityThread.update({
      where: { id: params.id },
      data: {
        title,
        content,
        isPinned,
        isLocked
      }
    })

    return NextResponse.json(updatedThread)
  } catch (error) {
    console.error('Error updating thread:', error)
    return NextResponse.json(
      { error: 'Failed to update thread' },
      { status: 500 }
    )
  }
}

// DELETE /api/community/threads/[id] - Delete thread (author or admin only)
export async function DELETE(
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

    // Check ownership or admin status
    const thread = await prisma.communityThread.findUnique({
      where: { id: params.id }
    })

    if (!thread) {
      return NextResponse.json(
        { error: 'Thread not found' },
        { status: 404 }
      )
    }

    // TODO: Check if user is author or admin

    await prisma.communityThread.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting thread:', error)
    return NextResponse.json(
      { error: 'Failed to delete thread' },
      { status: 500 }
    )
  }
}
