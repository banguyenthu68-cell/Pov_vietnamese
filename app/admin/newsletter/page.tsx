'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface NewsletterStats {
  totalSubscribers: number
  totalUnsubscribed: number
  recentSubscribers: number
}

export default function NewsletterPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [testEmail, setTestEmail] = useState('')
  const [isTestMode, setIsTestMode] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [stats, setStats] = useState<NewsletterStats | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    // Fetch newsletter statistics
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/newsletter/send')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    if (session) {
      fetchStats()
    }
  }, [session])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    setMessage(null)

    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          content,
          testMode: isTestMode,
          testEmail: isTestMode ? testEmail : undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: 'success',
          text: data.message || 'Newsletter sent successfully!'
        })
        if (!isTestMode) {
          setSubject('')
          setContent('')
        }
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to send newsletter'
        })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An error occurred while sending the newsletter'
      })
    } finally {
      setIsSending(false)
    }
  }

  const insertTemplate = () => {
    setContent(`
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
      .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
      .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Xin chào, {{name}}! 👋</h1>
        <p>Your newsletter title here</p>
      </div>
      <div class="content">
        <p>Your content here...</p>

        <p>Use {{name}} to personalize with subscriber names.</p>

        <a href="https://instagram.com/pov_vietnamese" class="button">Follow on Instagram</a>
      </div>
      <div class="footer">
        <p>POV Vietnamese - Learn Vietnamese with confidence</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/unsubscribe">Unsubscribe</a></p>
      </div>
    </div>
  </body>
</html>
    `.trim())
  }

  if (status === 'loading') {
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Newsletter Composer</h1>

          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-purple-50 rounded-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{stats.totalSubscribers}</div>
                <div className="text-sm text-gray-600">Active Subscribers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.recentSubscribers}</div>
                <div className="text-sm text-gray-600">New (30 days)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">{stats.totalUnsubscribed}</div>
                <div className="text-sm text-gray-600">Unsubscribed</div>
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSend} className="space-y-6">
            {/* Test Mode Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="testMode"
                checked={isTestMode}
                onChange={(e) => setIsTestMode(e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="testMode" className="text-sm text-gray-700">
                Test Mode (send to test email only)
              </label>
            </div>

            {/* Test Email */}
            {isTestMode && (
              <div>
                <label htmlFor="testEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Test Email
                </label>
                <input
                  type="email"
                  id="testEmail"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  required={isTestMode}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
            )}

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Your newsletter subject..."
              />
            </div>

            {/* Content */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  HTML Content
                </label>
                <button
                  type="button"
                  onClick={insertTemplate}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Insert Template
                </button>
              </div>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                placeholder="Paste your HTML content here... Use {{name}} to personalize with subscriber names."
              />
              <p className="mt-2 text-sm text-gray-500">
                Tip: Use <code className="bg-gray-100 px-1 py-0.5 rounded">{'{{name}}'}</code> to personalize with subscriber names
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isSending ? 'Sending...' : isTestMode ? 'Send Test Email' : 'Send to All Subscribers'}
            </button>
          </form>

          {/* Tips */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Tips:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Always send a test email first to check formatting</li>
              <li>• Use the template button to get started with a styled layout</li>
              <li>• Include a clear call-to-action in your newsletters</li>
              <li>• Keep content concise and mobile-friendly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
