import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendBookingConfirmationEmail, sendAdminBookingNotification } from '@/lib/email'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    const where: any = {}
    if (userId) where.userId = userId
    if (status) where.status = status

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        classType: true
      },
      orderBy: {
        scheduledAt: 'asc'
      }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, classTypeId, scheduledAt, notes } = body

    // Check if the time slot is available
    const existingBooking = await prisma.booking.findFirst({
      where: {
        scheduledAt: new Date(scheduledAt),
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    })

    if (existingBooking) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 400 }
      )
    }

    // Get class type to calculate price
    const classType = await prisma.classType.findUnique({
      where: { id: classTypeId }
    })

    if (!classType) {
      return NextResponse.json(
        { error: 'Class type not found' },
        { status: 404 }
      )
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        classTypeId,
        scheduledAt: new Date(scheduledAt),
        totalPrice: classType.price,
        status: 'PENDING',
        notes: notes || null
      },
      include: {
        classType: true,
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    // Send confirmation email to user
    const scheduledDate = new Date(scheduledAt)
    const timeString = scheduledDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    })

    await sendBookingConfirmationEmail(
      booking.user.email,
      booking.user.name || 'Student',
      classType.name,
      scheduledDate,
      timeString
    )

    // Send notification to admin
    await sendAdminBookingNotification({
      userName: booking.user.name || 'Unknown',
      userEmail: booking.user.email,
      className: classType.name,
      date: scheduledDate,
      time: timeString,
      phone: booking.user.phone || undefined,
      message: notes || undefined
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
