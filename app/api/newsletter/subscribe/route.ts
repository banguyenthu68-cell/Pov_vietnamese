import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email }
    })

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { error: 'Email is already subscribed' },
          { status: 400 }
        )
      } else {
        // Reactivate subscription
        const subscription = await prisma.newsletterSubscription.update({
          where: { email },
          data: {
            isActive: true,
            name: name || existing.name
          }
        })
        return NextResponse.json({
          message: 'Subscription reactivated successfully',
          subscription
        })
      }
    }

    // Create new subscription
    const subscription = await prisma.newsletterSubscription.create({
      data: {
        email,
        name: name || null,
        isActive: true,
        subscribedAt: new Date()
      }
    })

    // Send welcome email
    await sendWelcomeEmail(email, name)

    return NextResponse.json({
      message: 'Subscribed successfully',
      subscription
    }, { status: 201 })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}
