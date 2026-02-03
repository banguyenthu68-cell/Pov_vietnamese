import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    // Check authentication
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

    // Get total students (users)
    const totalStudents = await prisma.user.count()

    // Get total courses
    const totalCourses = await prisma.course.count()

    // Get total enrollments
    const totalEnrollments = await prisma.enrollment.count()

    // Calculate total revenue (sum of all confirmed booking prices + course enrollments)
    const bookingRevenue = await prisma.booking.aggregate({
      where: {
        status: 'CONFIRMED'
      },
      _sum: {
        totalPrice: true
      }
    })

    const courseRevenue = await prisma.course.aggregate({
      _sum: {
        price: true
      }
    })

    // Approximate course revenue by multiplying course prices by student count
    const courses = await prisma.course.findMany({
      select: {
        price: true,
        studentCount: true
      }
    })

    const totalCourseRevenue = courses.reduce((sum, course) => {
      return sum + (course.price * course.studentCount)
    }, 0)

    const totalRevenue = (bookingRevenue._sum.totalPrice || 0) + totalCourseRevenue

    // Get recent bookings (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentBookings = await prisma.booking.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    // Get active newsletter subscribers
    const activeSubscribers = await prisma.newsletterSubscription.count({
      where: {
        isActive: true
      }
    })

    return NextResponse.json({
      totalStudents,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      recentBookings,
      activeSubscribers
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
