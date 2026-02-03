import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get('date')

    if (!dateStr) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      )
    }

    const date = new Date(dateStr)
    const startOfDay = new Date(date.setHours(0, 0, 0, 0))
    const endOfDay = new Date(date.setHours(23, 59, 59, 999))

    // Get all bookings for that day
    const bookings = await prisma.booking.findMany({
      where: {
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      },
      select: {
        scheduledAt: true,
        classType: {
          select: {
            duration: true
          }
        }
      }
    })

    // Define available time slots (9 AM to 6 PM)
    const allTimeSlots = [
      '09:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
    ]

    // Convert to availability object
    const bookedSlots = new Set(
      bookings.map(b => {
        const hour = b.scheduledAt.getHours()
        return `${hour.toString().padStart(2, '0')}:00`
      })
    )

    const availability = allTimeSlots.map(slot => ({
      time: slot,
      available: !bookedSlots.has(slot),
      displayTime: convertTo12Hour(slot)
    }))

    return NextResponse.json(availability)
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}

function convertTo12Hour(time24: string): string {
  const [hours, minutes] = time24.split(':')
  const hour = parseInt(hours)
  const period = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${period}`
}
