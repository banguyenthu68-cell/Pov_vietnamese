'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CreditCard, Lock, CheckCircle } from 'lucide-react'

interface Course {
  id: string
  title: string
  price: number
  instructor: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseId = searchParams.get('courseId')

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (courseId) {
      fetchCourse(courseId)
    }
  }, [courseId])

  const fetchCourse = async (id: string) => {
    try {
      const response = await fetch(`/api/courses/${id}`)
      const data = await response.json()
      setCourse(data)
    } catch (error) {
      console.error('Error fetching course:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!course) return

    setProcessing(true)

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id })
      })

      if (response.ok) {
        const { url } = await response.json()
        // Redirect to Stripe checkout
        window.location.href = url
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create checkout session. Please try again.')
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      alert('Failed to process payment. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
          <p className="text-gray-600">Secure checkout powered by Stripe</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="border-b border-gray-200 pb-4 mb-4">
              <h3 className="font-bold text-gray-900 mb-1">{course.title}</h3>
              <p className="text-sm text-gray-600">by {course.instructor}</p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-700">
                <span>Course Price</span>
                <span>${course.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Platform Fee</span>
                <span>$0.00</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>${course.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 bg-indigo-50 rounded-lg p-4">
              <h4 className="font-bold text-indigo-900 mb-2">What's included:</h4>
              <ul className="space-y-2 text-sm text-indigo-900">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-indigo-600" />
                  Lifetime access to course
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-indigo-600" />
                  All video lessons
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-indigo-600" />
                  Downloadable resources
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-indigo-600" />
                  Certificate of completion
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h2>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-indigo-900">
                <strong>Secure Payment:</strong> Clicking "Proceed to Payment" will redirect you to
                Stripe's secure checkout page to complete your purchase.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock className="h-5 w-5" />
                  {processing ? 'Redirecting to Stripe...' : `Proceed to Payment - $${course.price.toFixed(2)}`}
                </button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-4 text-gray-500">
                <CreditCard className="h-5 w-5" />
                <span className="text-xs">Secured by Stripe</span>
              </div>

              <p className="text-xs text-center text-gray-600 mt-4">
                Your payment information is handled securely by Stripe. We never see or store your card details.
              </p>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            By completing this purchase, you agree to our{' '}
            <a href="/terms" className="text-indigo-600 hover:text-indigo-700">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-indigo-600 hover:text-indigo-700">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}
