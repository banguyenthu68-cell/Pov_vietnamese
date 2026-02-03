'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface DashboardStats {
  totalStudents: number
  totalCourses: number
  totalEnrollments: number
  totalRevenue: number
  recentBookings: number
  activeSubscribers: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchStats()
    }
  }, [session])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {session.user?.name || 'Admin'}</span>
              <Link
                href="/"
                className="text-purple-600 hover:text-purple-700"
              >
                View Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/courses"
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Manage Courses</h3>
                <p className="text-purple-100">Create and edit courses</p>
              </div>
              <svg className="w-12 h-12 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </Link>

          <Link
            href="/admin/blog"
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Manage Blog</h3>
                <p className="text-blue-100">Write and publish posts</p>
              </div>
              <svg className="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          </Link>

          <Link
            href="/admin/newsletter"
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Send Newsletter</h3>
                <p className="text-green-100">Email your subscribers</p>
              </div>
              <svg className="w-12 h-12 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{stats.totalStudents}</div>
                <div className="text-sm text-gray-600 mt-1">Total Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.totalCourses}</div>
                <div className="text-sm text-gray-600 mt-1">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.totalEnrollments}</div>
                <div className="text-sm text-gray-600 mt-1">Enrollments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">${stats.totalRevenue.toFixed(2)}</div>
                <div className="text-sm text-gray-600 mt-1">Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">{stats.recentBookings}</div>
                <div className="text-sm text-gray-600 mt-1">Recent Bookings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{stats.activeSubscribers}</div>
                <div className="text-sm text-gray-600 mt-1">Subscribers</div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Management Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/bookings"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <h3 className="font-semibold text-gray-900 mb-2">View Bookings</h3>
            <p className="text-sm text-gray-600">Manage class bookings</p>
          </Link>

          <Link
            href="/admin/students"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <h3 className="font-semibold text-gray-900 mb-2">View Students</h3>
            <p className="text-sm text-gray-600">Student management</p>
          </Link>

          <Link
            href="/admin/classes"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Class Types</h3>
            <p className="text-sm text-gray-600">Manage class offerings</p>
          </Link>

          <Link
            href="/community"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Community Forum</h3>
            <p className="text-sm text-gray-600">Monitor discussions</p>
          </Link>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Getting Started</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Create your first course to start enrolling students</li>
            <li>• Set up class types for one-on-one or group sessions</li>
            <li>• Send a welcome newsletter to your subscribers</li>
            <li>• Configure your Stripe account to accept payments</li>
            <li>• Join the community forum to engage with students</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
