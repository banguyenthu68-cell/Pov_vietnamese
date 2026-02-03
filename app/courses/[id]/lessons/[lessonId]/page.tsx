'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Play, CheckCircle, ChevronLeft, ChevronRight, BookOpen, FileText } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  description: string
  videoUrl: string
  duration: string
  transcript?: string
  resources?: { title: string; url: string }[]
  notes?: string
  isCompleted: boolean
}

interface Course {
  id: string
  title: string
  modules: {
    id: string
    title: string
    lessons: { id: string; title: string; isCompleted: boolean }[]
  }[]
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'transcript' | 'resources'>('overview')
  const [videoProgress, setVideoProgress] = useState(0)

  useEffect(() => {
    if (params.id && params.lessonId) {
      fetchLesson(params.id as string, params.lessonId as string)
      fetchCourse(params.id as string)
    }
  }, [params.id, params.lessonId])

  const fetchLesson = async (courseId: string, lessonId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}`)
      const data = await response.json()
      setLesson(data)
    } catch (error) {
      console.error('Error fetching lesson:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCourse = async (courseId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`)
      const data = await response.json()
      setCourse(data)
    } catch (error) {
      console.error('Error fetching course:', error)
    }
  }

  const markAsComplete = async () => {
    if (!lesson || lesson.isCompleted) return

    try {
      const response = await fetch(`/api/courses/${params.id}/lessons/${params.lessonId}/complete`, {
        method: 'POST'
      })

      if (response.ok) {
        setLesson({ ...lesson, isCompleted: true })
        // Refresh course data to update progress
        if (params.id) {
          fetchCourse(params.id as string)
        }
      }
    } catch (error) {
      console.error('Error marking lesson as complete:', error)
    }
  }

  const navigateToLesson = (direction: 'prev' | 'next') => {
    if (!course || !params.lessonId) return

    const allLessons = course.modules.flatMap(m => m.lessons)
    const currentIndex = allLessons.findIndex(l => l.id === params.lessonId)

    if (direction === 'next' && currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1]
      router.push(`/courses/${params.id}/lessons/${nextLesson.id}`)
    } else if (direction === 'prev' && currentIndex > 0) {
      const prevLesson = allLessons[currentIndex - 1]
      router.push(`/courses/${params.id}/lessons/${prevLesson.id}`)
    }
  }

  const allLessons = course?.modules.flatMap(m => m.lessons) || []
  const currentIndex = allLessons.findIndex(l => l.id === params.lessonId)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < allLessons.length - 1

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Lesson not found</h2>
          <button
            onClick={() => router.push(`/courses/${params.id}`)}
            className="text-indigo-400 hover:text-indigo-300"
          >
            Back to course
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Video Player Section */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto">
          {/* Video Player */}
          <div className="relative aspect-video bg-gray-950 flex items-center justify-center">
            {/* Placeholder for video player - In production, use a video player library like video.js or plyr */}
            <div className="text-center text-white">
              <Play className="h-24 w-24 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium">{lesson.title}</p>
              <p className="text-gray-400 mt-2">Video Player Placeholder</p>
              <p className="text-sm text-gray-500 mt-1">
                Integrate with video hosting service (Vimeo, YouTube, Cloudflare Stream, etc.)
              </p>
            </div>
          </div>

          {/* Video Controls Info */}
          <div className="bg-gray-950 border-t border-gray-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigateToLesson('prev')}
                  disabled={!hasPrev}
                  className="flex items-center gap-2 text-white hover:text-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="text-sm font-medium">Previous</span>
                </button>
                <div className="h-6 w-px bg-gray-700"></div>
                <button
                  onClick={() => navigateToLesson('next')}
                  disabled={!hasNext}
                  className="flex items-center gap-2 text-white hover:text-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="text-sm font-medium">Next</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <button
                onClick={markAsComplete}
                disabled={lesson.isCompleted}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  lesson.isCompleted
                    ? 'bg-green-600 text-white cursor-default'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <CheckCircle className="h-5 w-5" />
                {lesson.isCompleted ? 'Completed' : 'Mark as Complete'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6 mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">{lesson.title}</h1>
              <p className="text-gray-400">{lesson.description}</p>
            </div>

            {/* Tabs */}
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <div className="border-b border-gray-700">
                <div className="flex">
                  {[
                    { key: 'overview', label: 'Overview', icon: BookOpen },
                    { key: 'transcript', label: 'Transcript', icon: FileText },
                    { key: 'resources', label: 'Resources', icon: FileText }
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key as any)}
                      className={`flex-1 px-6 py-4 font-medium flex items-center justify-center gap-2 transition-colors ${
                        activeTab === key
                          ? 'text-indigo-400 border-b-2 border-indigo-400 bg-gray-750'
                          : 'text-gray-400 hover:text-white hover:bg-gray-750'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="text-gray-300 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">About this lesson</h3>
                      <p>{lesson.description}</p>
                    </div>
                    {lesson.notes && (
                      <div>
                        <h3 className="text-xl font-bold text-white mb-3">Lesson Notes</h3>
                        <div className="bg-gray-900 rounded-lg p-4">
                          <p className="whitespace-pre-wrap">{lesson.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'transcript' && (
                  <div className="text-gray-300">
                    <h3 className="text-xl font-bold text-white mb-4">Video Transcript</h3>
                    {lesson.transcript ? (
                      <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                        <p className="whitespace-pre-wrap leading-relaxed">{lesson.transcript}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No transcript available for this lesson.</p>
                    )}
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Downloadable Resources</h3>
                    {lesson.resources && lesson.resources.length > 0 ? (
                      <div className="space-y-3">
                        {lesson.resources.map((resource, index) => (
                          <a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-gray-900 rounded-lg p-4 hover:bg-gray-750 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-indigo-400" />
                                <span className="text-white font-medium">{resource.title}</span>
                              </div>
                              <span className="text-indigo-400 text-sm">Download</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No resources available for this lesson.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Course Content */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 sticky top-4">
              <h3 className="text-xl font-bold text-white mb-4">Course Content</h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {course?.modules.map((module) => (
                  <div key={module.id} className="mb-4">
                    <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">
                      {module.title}
                    </h4>
                    <div className="space-y-1">
                      {module.lessons.map((l) => (
                        <button
                          key={l.id}
                          onClick={() => router.push(`/courses/${params.id}/lessons/${l.id}`)}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                            l.id === params.lessonId
                              ? 'bg-indigo-600 text-white'
                              : 'text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {l.isCompleted ? (
                            <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                          ) : (
                            <Play className="h-4 w-4 flex-shrink-0" />
                          )}
                          <span className="text-sm truncate">{l.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => router.push(`/courses/${params.id}`)}
                className="w-full mt-6 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
