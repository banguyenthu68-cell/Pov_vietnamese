'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Module {
  title: string
  description: string
  order: number
  lessons: Lesson[]
}

interface Lesson {
  title: string
  description: string
  videoUrl: string
  duration: number
  order: number
  isFree: boolean
}

export default function NewCoursePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [level, setLevel] = useState('BEGINNER')
  const [thumbnail, setThumbnail] = useState('')
  const [modules, setModules] = useState<Module[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const addModule = () => {
    setModules([
      ...modules,
      {
        title: '',
        description: '',
        order: modules.length + 1,
        lessons: []
      }
    ])
  }

  const removeModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index))
  }

  const updateModule = (index: number, field: string, value: any) => {
    const updated = [...modules]
    updated[index] = { ...updated[index], [field]: value }
    setModules(updated)
  }

  const addLesson = (moduleIndex: number) => {
    const updated = [...modules]
    updated[moduleIndex].lessons.push({
      title: '',
      description: '',
      videoUrl: '',
      duration: 0,
      order: updated[moduleIndex].lessons.length + 1,
      isFree: false
    })
    setModules(updated)
  }

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const updated = [...modules]
    updated[moduleIndex].lessons = updated[moduleIndex].lessons.filter((_, i) => i !== lessonIndex)
    setModules(updated)
  }

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: string, value: any) => {
    const updated = [...modules]
    updated[moduleIndex].lessons[lessonIndex] = {
      ...updated[moduleIndex].lessons[lessonIndex],
      [field]: value
    }
    setModules(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          level,
          thumbnail: thumbnail || null,
          modules
        }),
      })

      if (response.ok) {
        const course = await response.json()
        router.push(`/admin/courses`)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create course')
      }
    } catch (error) {
      console.error('Error creating course:', error)
      setError('An error occurred while creating the course')
    } finally {
      setIsSaving(false)
    }
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

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/admin/courses" className="text-purple-600 hover:text-purple-700 text-sm mb-2 inline-block">
            ← Back to Courses
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {/* Course Details */}
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900">Course Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Complete Vietnamese for Beginners"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe what students will learn..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="49.99"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level *
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail URL (optional)
              </label>
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Modules */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Course Modules</h2>
              <button
                type="button"
                onClick={addModule}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                + Add Module
              </button>
            </div>

            {modules.length === 0 ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-600">No modules yet. Add your first module to get started.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="border border-gray-300 rounded-lg p-6 bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-gray-900">Module {moduleIndex + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeModule(moduleIndex)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove Module
                      </button>
                    </div>

                    <div className="space-y-4 mb-4">
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Module title..."
                      />
                      <textarea
                        value={module.description}
                        onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Module description..."
                      />
                    </div>

                    {/* Lessons */}
                    <div className="ml-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-700">Lessons</h4>
                        <button
                          type="button"
                          onClick={() => addLesson(moduleIndex)}
                          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          + Add Lesson
                        </button>
                      </div>

                      {module.lessons.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No lessons yet</p>
                      ) : (
                        <div className="space-y-3">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="bg-white border border-gray-200 rounded p-4">
                              <div className="flex justify-between items-start mb-3">
                                <span className="text-sm font-medium text-gray-700">Lesson {lessonIndex + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => removeLesson(moduleIndex, lessonIndex)}
                                  className="text-red-600 hover:text-red-700 text-xs"
                                >
                                  Remove
                                </button>
                              </div>

                              <div className="space-y-3">
                                <input
                                  type="text"
                                  value={lesson.title}
                                  onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)}
                                  required
                                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                  placeholder="Lesson title..."
                                />
                                <textarea
                                  value={lesson.description}
                                  onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'description', e.target.value)}
                                  rows={2}
                                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                  placeholder="Lesson description..."
                                />
                                <div className="grid grid-cols-2 gap-3">
                                  <input
                                    type="url"
                                    value={lesson.videoUrl}
                                    onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'videoUrl', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                    placeholder="Video URL..."
                                  />
                                  <input
                                    type="number"
                                    value={lesson.duration}
                                    onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'duration', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                    placeholder="Duration (minutes)"
                                  />
                                </div>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={lesson.isFree}
                                    onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'isFree', e.target.checked)}
                                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                  />
                                  <span className="text-sm text-gray-700">Free preview lesson</span>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/courses"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
