'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, ArrowRight, BookOpen } from 'lucide-react'
import confetti from 'canvas-confetti'

interface Course {
  id: string
  title: string
  instructor: string
}

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [course, setCourse] = useState<Course | null>(null)
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        setVerifying(false)
        return
      }

      try {
        // Verify the Stripe session and get course details
        const response = await fetch(`/api/checkout/verify?session_id=${sessionId}`)
        const data = await response.json()

        if (data.course) {
          setCourse(data.course)

          // Trigger confetti animation
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          })
        }
      } catch (error) {
        console.error('Error verifying session:', error)
      } finally {
        setVerifying(false)
      }
    }

    verifySession()
  }, [sessionId])

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment verification failed</h2>
          <p className="text-gray-600 mb-4">We couldn't verify your payment. Please contact support.</p>
          <button
            onClick={() => router.push('/courses')}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Back to courses
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
              <CheckCircle className="h-14 w-14 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Enrollment Successful!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Welcome to {course?.title || 'your new course'}
          </p>

          {/* Course Info */}
          {course && (
            <div className="bg-indigo-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h2>
              <p className="text-gray-600">Taught by {course.instructor}</p>
            </div>
          )}

          {/* Next Steps */}
          <div className="text-left mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">What's Next?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Check your email</p>
                  <p className="text-sm text-gray-600">We've sent you a confirmation with course details</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Start learning</p>
                  <p className="text-sm text-gray-600">Access all course materials immediately</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Track your progress</p>
                  <p className="text-sm text-gray-600">Mark lessons complete as you go</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push(`/courses/${course.id}`)}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              Start Learning Now
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => router.push('/courses')}
              className="w-full bg-white text-indigo-600 py-3 px-6 rounded-lg font-medium border-2 border-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="h-5 w-5" />
              Browse More Courses
            </button>
          </div>
        </div>

        {/* Support Info */}
        <p className="text-center text-gray-600 mt-6">
          Need help? Contact us at{' '}
          <a href="mailto:support@pov-vietnamese.com" className="text-indigo-600 hover:text-indigo-700 font-medium">
            support@pov-vietnamese.com
          </a>
        </p>
      </div>
    </div>
  )
}
