'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Play, Lock, CheckCircle, Clock, BookOpen, Users, Star, Video, Award } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  duration: string
  isCompleted: boolean
  isFree: boolean
  videoUrl?: string
}

interface Module {
  id: string
  title: string
  description: string
  lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  instructorBio: string
  thumbnail: string
  price: number
  duration: string
  studentCount: number
  rating: number
  level: string
  lessonsCount: number
  isEnrolled: boolean
  category: string
  modules: Module[]
  whatYouWillLearn: string[]
  requirements: string[]
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [activeModule, setActiveModule] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchCourse(params.id as string)
    }
  }, [params.id])

  const fetchCourse = async (id: string) => {
    try {
      const response = await fetch(`/api/courses/${id}`)
      const data = await response.json()
      setCourse(data)
      if (data.modules.length > 0) {
        setActiveModule(data.modules[0].id)
      }
    } catch (error) {
      console.error('Error fetching course:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    if (!course) return

    setEnrolling(true)
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id })
      })

      if (response.ok) {
        // Redirect to payment page
        router.push(`/checkout?courseId=${course.id}`)
      }
    } catch (error) {
      console.error('Error enrolling:', error)
    } finally {
      setEnrolling(false)
    }
  }

  const handleLessonClick = (lesson: Lesson) => {
    if (course?.isEnrolled || lesson.isFree) {
      router.push(`/courses/${course?.id}/lessons/${lesson.id}`)
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

  const completedLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.filter(l => l.isCompleted).length,
    0
  )
  const totalLessons = course.lessonsCount
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Course Info */}
            <div>
              <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mb-4">
                {course.level} • {course.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-indigo-100 mb-6">{course.description}</p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{course.rating} rating</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span className="font-medium">{course.studentCount} students</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  <span className="font-medium">{course.lessonsCount} lessons</span>
                </div>
              </div>

              {/* CTA */}
              {course.isEnrolled ? (
                <div>
                  <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium mb-3 inline-flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Enrolled
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Your Progress</span>
                      <span className="text-sm font-medium">{progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-green-400 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold">${course.price}</div>
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    {enrolling ? 'Processing...' : 'Enroll Now'}
                  </button>
                </div>
              )}
            </div>

            {/* Right: Thumbnail/Preview */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 aspect-video flex items-center justify-center">
                <Video className="h-24 w-24 text-white opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Learn</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {course.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
              <div className="space-y-4">
                {course.modules.map((module) => (
                  <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}
                      className="w-full bg-gray-50 px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900">{module.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                      </div>
                      <div className="text-sm text-gray-600">
                        {module.lessons.length} lessons
                      </div>
                    </button>

                    {activeModule === module.id && (
                      <div className="bg-white divide-y divide-gray-200">
                        {module.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => handleLessonClick(lesson)}
                            disabled={!course.isEnrolled && !lesson.isFree}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <div className="flex items-center gap-3">
                              {lesson.isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : course.isEnrolled || lesson.isFree ? (
                                <Play className="h-5 w-5 text-indigo-600" />
                              ) : (
                                <Lock className="h-5 w-5 text-gray-400" />
                              )}
                              <div className="text-left">
                                <div className="font-medium text-gray-900">{lesson.title}</div>
                                {lesson.isFree && !course.isEnrolled && (
                                  <span className="text-xs text-green-600 font-medium">Free Preview</span>
                                )}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {lesson.duration}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h2>
              <ul className="space-y-3">
                {course.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-indigo-600 mr-3">•</span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              {/* Instructor */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Your Instructor</h3>
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full h-12 w-12 flex items-center justify-center text-white font-bold">
                    {course.instructor.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{course.instructor}</div>
                    <p className="text-sm text-gray-600 mt-1">{course.instructorBio}</p>
                  </div>
                </div>
              </div>

              {/* Course Features */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-700">
                  <Video className="h-5 w-5 mr-3 text-indigo-600" />
                  <span>{course.lessonsCount} video lessons</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Clock className="h-5 w-5 mr-3 text-indigo-600" />
                  <span>{course.duration} total content</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Award className="h-5 w-5 mr-3 text-indigo-600" />
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <BookOpen className="h-5 w-5 mr-3 text-indigo-600" />
                  <span>Lifetime access</span>
                </div>
              </div>

              {/* Enroll Button */}
              {!course.isEnrolled && (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {enrolling ? 'Processing...' : `Enroll for $${course.price}`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
