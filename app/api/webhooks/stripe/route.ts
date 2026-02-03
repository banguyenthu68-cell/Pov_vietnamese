import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendEnrollmentConfirmationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      if (session.payment_status === 'paid') {
        const userId = session.metadata?.userId
        const courseId = session.metadata?.courseId

        if (!userId || !courseId) {
          console.error('Missing metadata in checkout session')
          return NextResponse.json(
            { error: 'Missing metadata' },
            { status: 400 }
          )
        }

        try {
          // Create enrollment
          await prisma.enrollment.create({
            data: {
              userId: userId,
              courseId: courseId,
              progress: 0
            }
          })

          // Increment student count
          await prisma.course.update({
            where: { id: courseId },
            data: {
              studentCount: {
                increment: 1
              }
            }
          })

          // Get user and course details for email
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, name: true }
          })

          const course = await prisma.course.findUnique({
            where: { id: courseId },
            select: { name: true }
          })

          if (user && course) {
            // Send confirmation email to user
            await sendEnrollmentConfirmationEmail(
              user.email,
              user.name || 'Student',
              course.name,
              courseId
            )
          }

          console.log(`Enrollment created for user ${userId} in course ${courseId}`)
        } catch (error) {
          console.error('Error creating enrollment:', error)
          return NextResponse.json(
            { error: 'Failed to create enrollment' },
            { status: 500 }
          )
        }
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.error('Payment failed:', paymentIntent.id)
      // TODO: Send failure notification email
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
