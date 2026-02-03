import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// POST /api/community/replies/[id]/like - Toggle like on a reply
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

    const userId = session.user.id

    // Check if reply exists
    const reply = await prisma.communityReply.findUnique({
      where: { id: params.id }
    })

    if (!reply) {
      return NextResponse.json(
        { error: 'Reply not found' },
        { status: 404 }
      )
    }

    // Check if user already liked this reply
    const existingLike = await prisma.replyLike.findUnique({
      where: {
        userId_replyId: {
          userId: userId,
          replyId: params.id
        }
      }
    })

    if (existingLike) {
      // Unlike - remove the like
      await prisma.replyLike.delete({
        where: {
          userId_replyId: {
            userId: userId,
            replyId: params.id
          }
        }
      })

      return NextResponse.json({ liked: false })
    } else {
      // Like - add the like
      await prisma.replyLike.create({
        data: {
          userId: userId,
          replyId: params.id
        }
      })

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}
