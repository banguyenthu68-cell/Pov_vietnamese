'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MessageSquare, Users, TrendingUp, Plus, Search, Pin, Lock } from 'lucide-react'

interface Thread {
  id: string
  title: string
  content: string
  author: string
  category: string
  isPinned: boolean
  isLocked: boolean
  replyCount: number
  viewCount: number
  createdAt: string
  lastActivity: string
}

export default function CommunityPage() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    fetchThreads()
  }, [])

  const fetchThreads = async () => {
    try {
      const response = await fetch('/api/community/threads')
      const data = await response.json()
      setThreads(data)
    } catch (error) {
      console.error('Error fetching threads:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'all', name: 'All Discussions', icon: MessageSquare },
    { id: 'general', name: 'General', icon: MessageSquare },
    { id: 'grammar', name: 'Grammar Help', icon: MessageSquare },
    { id: 'pronunciation', name: 'Pronunciation', icon: MessageSquare },
    { id: 'culture', name: 'Culture & Customs', icon: Users },
    { id: 'resources', name: 'Resources', icon: TrendingUp },
    { id: 'announcements', name: 'Announcements', icon: Pin }
  ]

  const filteredThreads = threads.filter(thread => {
    const matchesSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thread.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || thread.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const pinnedThreads = filteredThreads.filter(t => t.isPinned)
  const regularThreads = filteredThreads.filter(t => !t.isPinned)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Community Forum</h1>
          <p className="text-xl text-indigo-100 max-w-3xl">
            Connect with fellow Vietnamese learners, ask questions, share experiences, and support each other on your language learning journey.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  const count = threads.filter(t =>
                    category.id === 'all' || t.category === category.id
                  ).length

                  return (
                    <button
                      key={category.id}
                      onClick={() => setCategoryFilter(category.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        categoryFilter === category.id
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className={`text-sm ${
                        categoryFilter === category.id ? 'text-indigo-200' : 'text-gray-500'
                      }`}>
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>

              <Link
                href="/community/new"
                className="w-full mt-6 bg-indigo-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                New Thread
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Community Stats */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 rounded-full p-3">
                    <MessageSquare className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{threads.length}</div>
                    <div className="text-sm text-gray-600">Total Threads</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 rounded-full p-3">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">1,247</div>
                    <div className="text-sm text-gray-600">Community Members</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 rounded-full p-3">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">342</div>
                    <div className="text-sm text-gray-600">Active This Week</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Thread List */}
            {loading ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading discussions...</p>
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600 mb-4">No discussions found</p>
                <Link
                  href="/community/new"
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Start a New Discussion
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Pinned Threads */}
                {pinnedThreads.length > 0 && (
                  <div className="space-y-4">
                    {pinnedThreads.map((thread) => (
                      <Link key={thread.id} href={`/community/threads/${thread.id}`}>
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Pin className="h-4 w-4 text-yellow-600" />
                                <span className="text-xs font-bold text-yellow-700 uppercase">Pinned</span>
                                {thread.isLocked && (
                                  <Lock className="h-4 w-4 text-gray-500" />
                                )}
                                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                                  {thread.category}
                                </span>
                              </div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">{thread.title}</h3>
                              <p className="text-gray-600 line-clamp-2">{thread.content}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-4">
                              <span>By {thread.author}</span>
                              <span>•</span>
                              <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span>{thread.viewCount} views</span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                {thread.replyCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Regular Threads */}
                {regularThreads.map((thread) => (
                  <Link key={thread.id} href={`/community/threads/${thread.id}`}>
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                              {thread.category}
                            </span>
                            {thread.isLocked && (
                              <Lock className="h-4 w-4 text-gray-500" />
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{thread.title}</h3>
                          <p className="text-gray-600 line-clamp-2">{thread.content}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span>By {thread.author}</span>
                          <span>•</span>
                          <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span>{thread.viewCount} views</span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {thread.replyCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
