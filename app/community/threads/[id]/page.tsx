'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MessageSquare, ThumbsUp, Pin, Lock, MoreVertical, Send } from 'lucide-react'

interface Reply {
  id: string
  content: string
  author: string
  authorAvatar?: string
  createdAt: string
  likes: number
  isLiked: boolean
}

interface Thread {
  id: string
  title: string
  content: string
  author: string
  authorAvatar?: string
  category: string
  isPinned: boolean
  isLocked: boolean
  replyCount: number
  viewCount: number
  createdAt: string
  replies: Reply[]
}

export default function ThreadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [thread, setThread] = useState<Thread | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchThread(params.id as string)
    }
  }, [params.id])

  const fetchThread = async (id: string) => {
    try {
      const response = await fetch(`/api/community/threads/${id}`)
      const data = await response.json()
      setThread(data)
    } catch (error) {
      console.error('Error fetching thread:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim() || !thread) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/community/threads/${thread.id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent })
      })

      if (response.ok) {
        setReplyContent('')
        fetchThread(thread.id)
      }
    } catch (error) {
      console.error('Error submitting reply:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLike = async (replyId: string) => {
    try {
      await fetch(`/api/community/replies/${replyId}/like`, {
        method: 'POST'
      })
      if (thread) {
        fetchThread(thread.id)
      }
    } catch (error) {
      console.error('Error liking reply:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thread not found</h2>
          <button
            onClick={() => router.push('/community')}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Back to community
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/community')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Community
          </button>

          <div className="flex items-center gap-2 mb-2">
            {thread.isPinned && (
              <div className="flex items-center gap-1 text-yellow-600">
                <Pin className="h-4 w-4" />
                <span className="text-xs font-bold uppercase">Pinned</span>
              </div>
            )}
            {thread.isLocked && (
              <div className="flex items-center gap-1 text-gray-500">
                <Lock className="h-4 w-4" />
                <span className="text-xs font-bold uppercase">Locked</span>
              </div>
            )}
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
              {thread.category}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{thread.title}</h1>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full h-8 w-8 flex items-center justify-center text-white font-bold text-sm">
                  {thread.author.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{thread.author}</span>
              </div>
              <span>•</span>
              <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{thread.viewCount} views</span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {thread.replyCount} replies
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Original Post */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{thread.content}</p>
          </div>
        </div>

        {/* Replies */}
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {thread.replyCount} {thread.replyCount === 1 ? 'Reply' : 'Replies'}
          </h2>

          {thread.replies.map((reply) => (
            <div key={reply.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {reply.author.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-bold text-gray-900">{reply.author}</span>
                      <span className="text-sm text-gray-600 ml-3">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>

                  <p className="text-gray-700 mb-3 whitespace-pre-wrap">{reply.content}</p>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(reply.id)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                        reply.isLiked
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm font-medium">{reply.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Form */}
        {!thread.isLocked ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add a Reply</h3>
            <form onSubmit={handleSubmitReply}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={submitting || !replyContent.trim()}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? 'Posting...' : 'Post Reply'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-xl shadow-lg p-8 text-center">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">This thread is locked. No new replies can be added.</p>
          </div>
        )}
      </div>
    </div>
  )
}
