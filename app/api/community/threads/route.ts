import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// GET /api/community/threads - List all threads
export async function GET(request: NextRequest) {
  try {
    const threads = await prisma.communityThread.findMany({
      include: {
        author: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            replies: true
          }
        }
      },
      orderBy: [
        { isPinned: 'desc' },
        { lastActivity: 'desc' }
      ]
    })

    const threadsWithStats = threads.map(thread => ({
      id: thread.id,
      title: thread.title,
      content: thread.content,
      author: thread.author.name || 'Anonymous',
      category: thread.category,
      isPinned: thread.isPinned,
      isLocked: thread.isLocked,
      replyCount: thread._count.replies,
      viewCount: thread.viewCount,
      createdAt: thread.createdAt.toISOString(),
      lastActivity: thread.lastActivity.toISOString()
    }))

    return NextResponse.json(threadsWithStats)
  } catch (error) {
    console.error('Error fetching threads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch threads' },
      { status: 500 }
    )
  }
}

// POST /api/community/threads - Create a new thread
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, content, category } = body

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      )
    }

    const thread = await prisma.communityThread.create({
      data: {
        title,
        content,
        category,
        authorId: session.user.id,
        isPinned: false,
        isLocked: false,
        viewCount: 0,
        lastActivity: new Date()
      },
      include: {
        author: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      id: thread.id,
      title: thread.title,
      content: thread.content,
      author: thread.author.name || 'Anonymous',
      category: thread.category,
      isPinned: thread.isPinned,
      isLocked: thread.isLocked,
      replyCount: 0,
      viewCount: thread.viewCount,
      createdAt: thread.createdAt.toISOString(),
      lastActivity: thread.lastActivity.toISOString()
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating thread:', error)
    return NextResponse.json(
      { error: 'Failed to create thread' },
      { status: 500 }
    )
  }
}
