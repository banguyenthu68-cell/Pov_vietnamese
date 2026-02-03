import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // TODO: Check if user has admin role
    // if (session.user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: 'Forbidden - Admin access required' },
    //     { status: 403 }
    //   )
    // }

    const body = await request.json()
    const { subject, content, testMode = false, testEmail } = body

    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 }
      )
    }

    // In test mode, only send to the test email
    if (testMode) {
      if (!testEmail) {
        return NextResponse.json(
          { error: 'Test email is required in test mode' },
          { status: 400 }
        )
      }

      const result = await sendEmail({
        to: testEmail,
        subject: `[TEST] ${subject}`,
        html: content
      })

      return NextResponse.json({
        message: 'Test email sent successfully',
        sent: 1,
        result
      })
    }

    // Get all active subscribers
    const subscribers = await prisma.newsletterSubscription.findMany({
      where: {
        isActive: true
      },
      select: {
        email: true,
        name: true
      }
    })

    if (subscribers.length === 0) {
      return NextResponse.json({
        message: 'No active subscribers found',
        sent: 0
      })
    }

    // Send emails to all subscribers
    const emailPromises = subscribers.map(subscriber => {
      // Personalize content by replacing {{name}} placeholder
      const personalizedContent = content.replace(
        /\{\{name\}\}/g,
        subscriber.name || 'there'
      )

      return sendEmail({
        to: subscriber.email,
        subject,
        html: personalizedContent
      })
    })

    const results = await Promise.allSettled(emailPromises)

    const successful = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length

    return NextResponse.json({
      message: `Newsletter sent to ${successful} subscribers`,
      sent: successful,
      failed,
      total: subscribers.length
    })
  } catch (error) {
    console.error('Error sending newsletter:', error)
    return NextResponse.json(
      { error: 'Failed to send newsletter' },
      { status: 500 }
    )
  }
}

// Get newsletter statistics
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const totalSubscribers = await prisma.newsletterSubscription.count({
      where: { isActive: true }
    })

    const totalUnsubscribed = await prisma.newsletterSubscription.count({
      where: { isActive: false }
    })

    // Get recent subscribers (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentSubscribers = await prisma.newsletterSubscription.count({
      where: {
        isActive: true,
        subscribedAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    return NextResponse.json({
      totalSubscribers,
      totalUnsubscribed,
      recentSubscribers
    })
  } catch (error) {
    console.error('Error fetching newsletter stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch newsletter statistics' },
      { status: 500 }
    )
  }
}
