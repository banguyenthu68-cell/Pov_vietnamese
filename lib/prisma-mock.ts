// Mock Prisma client for demo deployment without database
import {
  mockUsers,
  mockCourses,
  mockModules,
  mockLessons,
  mockBlogPosts,
  mockClassTypes,
  mockCommunityThreads,
  mockEnrollments,
  mockNewsletterSubscriptions,
  getMockCourses,
  getMockCourse,
  getMockBlogPosts,
  getMockBlogPost,
  getMockCommunityThreads,
  getMockStats,
} from './mock-data'

// Create a mock Prisma client that returns mock data
export const mockPrisma = {
  user: {
    findUnique: async ({ where }: any) => {
      return mockUsers.find(u => u.id === where.id || u.email === where.email) || null
    },
    findMany: async () => mockUsers,
    count: async () => mockUsers.length,
    create: async ({ data }: any) => ({
      id: `user${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  },
  course: {
    findMany: async ({ where, include }: any) => {
      let courses = getMockCourses(where?.isPublished !== undefined ? { isPublished: where.isPublished } : undefined)

      if (include?.modules) {
        courses = courses.map(course => ({
          ...course,
          modules: mockModules
            .filter(m => m.courseId === course.id)
            .map(module => ({
              ...module,
              lessons: include.modules.include?.lessons
                ? mockLessons.filter(l => l.moduleId === module.id)
                : []
            })),
          enrollments: include?.enrollments ? mockEnrollments.filter(e => e.courseId === course.id) : []
        }))
      }

      return courses
    },
    findUnique: async ({ where, include }: any) => {
      const course = getMockCourse(where.id)
      if (!course) return null

      if (include?.enrollments) {
        return {
          ...course,
          enrollments: mockEnrollments.filter(e => e.courseId === where.id)
        }
      }

      return course
    },
    count: async () => mockCourses.length,
    create: async ({ data }: any) => ({
      id: `course${Date.now()}`,
      ...data,
      studentCount: 0,
      rating: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    update: async ({ where, data }: any) => {
      const course = mockCourses.find(c => c.id === where.id)
      return course ? { ...course, ...data } : null
    },
    delete: async ({ where }: any) => {
      const course = mockCourses.find(c => c.id === where.id)
      return course || null
    },
    aggregate: async () => ({
      _sum: {
        price: mockCourses.reduce((sum, c) => sum + c.price, 0)
      }
    }),
  },
  module: {
    findMany: async ({ where }: any) => {
      return mockModules.filter(m => m.courseId === where?.courseId)
    },
  },
  lesson: {
    findUnique: async ({ where, include }: any) => {
      const lesson = mockLessons.find(l => l.id === where.id)
      if (!lesson || !include?.module) return lesson

      const module = mockModules.find(m => m.id === lesson.moduleId)
      return { ...lesson, module }
    },
  },
  blogPost: {
    findMany: async ({ where }: any) => {
      return getMockBlogPosts(where?.isPublished !== undefined ? { isPublished: where.isPublished } : undefined)
    },
    findUnique: async ({ where }: any) => {
      if (where.id) {
        return mockBlogPosts.find(p => p.id === where.id) || null
      }
      if (where.slug) {
        return getMockBlogPost(where.slug)
      }
      return null
    },
    create: async ({ data }: any) => ({
      id: `post${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    update: async ({ where, data }: any) => {
      const post = mockBlogPosts.find(p => p.id === where.id)
      return post ? { ...post, ...data } : null
    },
    delete: async ({ where }: any) => {
      const post = mockBlogPosts.find(p => p.id === where.id)
      return post || null
    },
  },
  classType: {
    findMany: async () => mockClassTypes,
    findUnique: async ({ where }: any) => {
      return mockClassTypes.find(c => c.id === where.id) || null
    },
  },
  booking: {
    findMany: async ({ where, include }: any) => {
      const bookings = [
        {
          id: 'booking1',
          userId: 'user1',
          classTypeId: 'class1',
          scheduledAt: new Date('2024-02-10T10:00:00'),
          totalPrice: 35.00,
          status: 'CONFIRMED',
          notes: 'Looking forward to the lesson!',
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date('2024-02-01'),
        }
      ]

      if (include?.user && include?.classType) {
        return bookings.map(b => ({
          ...b,
          user: mockUsers.find(u => u.id === b.userId),
          classType: mockClassTypes.find(c => c.id === b.classTypeId)
        }))
      }

      return bookings
    },
    findFirst: async () => null,
    count: async ({ where }: any) => {
      if (where?.createdAt?.gte) return 12
      return 24
    },
    create: async ({ data, include }: any) => {
      const booking = {
        id: `booking${Date.now()}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      if (include?.user && include?.classType) {
        return {
          ...booking,
          user: mockUsers.find(u => u.id === data.userId),
          classType: mockClassTypes.find(c => c.id === data.classTypeId)
        }
      }

      return booking
    },
    aggregate: async () => ({
      _sum: {
        totalPrice: 1250.50
      }
    }),
  },
  enrollment: {
    findMany: async ({ where }: any) => {
      let enrollments = [...mockEnrollments]
      if (where?.userId) {
        enrollments = enrollments.filter(e => e.userId === where.userId)
      }
      if (where?.courseId) {
        enrollments = enrollments.filter(e => e.courseId === where.courseId)
      }
      return enrollments
    },
    findUnique: async ({ where }: any) => {
      return mockEnrollments.find(e =>
        e.userId === where.userId_courseId?.userId &&
        e.courseId === where.userId_courseId?.courseId
      ) || null
    },
    count: async () => mockEnrollments.length,
    create: async ({ data }: any) => ({
      id: `enrollment${Date.now()}`,
      ...data,
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  },
  lessonProgress: {
    findUnique: async () => null,
    upsert: async ({ create }: any) => ({
      id: `progress${Date.now()}`,
      ...create,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  },
  communityThread: {
    findMany: async ({ where, include }: any) => {
      let threads = getMockCommunityThreads()

      if (where?.category) {
        threads = threads.filter(t => t.category === where.category)
      }

      if (where?.OR) {
        const searchTerm = where.OR[0]?.title?.contains?.toLowerCase() || ''
        threads = threads.filter(t =>
          t.title.toLowerCase().includes(searchTerm) ||
          t.content.toLowerCase().includes(searchTerm)
        )
      }

      return threads
    },
    findUnique: async ({ where, include }: any) => {
      const thread = mockCommunityThreads.find(t => t.id === where.id)
      if (!thread) return null

      if (include?.replies) {
        return {
          ...thread,
          replies: [
            {
              id: 'reply1',
              threadId: where.id,
              userId: 'admin1',
              content: 'Great question! I recommend practicing tones by...',
              likeCount: 5,
              createdAt: new Date('2024-02-01'),
              updatedAt: new Date('2024-02-01'),
              user: mockUsers[1],
              likes: []
            }
          ]
        }
      }

      return thread
    },
    create: async ({ data, include }: any) => ({
      id: `thread${Date.now()}`,
      ...data,
      views: 0,
      replyCount: 0,
      isPinned: false,
      isLocked: false,
      lastActivity: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      user: include?.user ? mockUsers.find(u => u.id === data.userId) : undefined
    }),
    update: async ({ where, data }: any) => {
      const thread = mockCommunityThreads.find(t => t.id === where.id)
      return thread ? { ...thread, ...data } : null
    },
    delete: async ({ where }: any) => {
      const thread = mockCommunityThreads.find(t => t.id === where.id)
      return thread || null
    },
  },
  communityReply: {
    create: async ({ data, include }: any) => ({
      id: `reply${Date.now()}`,
      ...data,
      likeCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: include?.user ? mockUsers.find(u => u.id === data.userId) : undefined
    }),
  },
  replyLike: {
    findUnique: async () => null,
    create: async ({ data }: any) => ({
      id: `like${Date.now()}`,
      ...data,
      createdAt: new Date(),
    }),
    delete: async () => ({}),
  },
  newsletterSubscription: {
    findUnique: async ({ where }: any) => {
      return mockNewsletterSubscriptions.find(s => s.email === where.email) || null
    },
    findMany: async ({ where, select }: any) => {
      let subs = [...mockNewsletterSubscriptions]
      if (where?.isActive !== undefined) {
        subs = subs.filter(s => s.isActive === where.isActive)
      }
      return subs
    },
    count: async ({ where }: any) => {
      if (where?.isActive === true) {
        return mockNewsletterSubscriptions.filter(s => s.isActive).length
      }
      if (where?.isActive === false) {
        return mockNewsletterSubscriptions.filter(s => !s.isActive).length
      }
      if (where?.AND) {
        return 15 // Recent subscribers
      }
      return mockNewsletterSubscriptions.length
    },
    create: async ({ data }: any) => ({
      id: `sub${Date.now()}`,
      ...data,
      subscribedAt: new Date(),
      unsubscribedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    update: async ({ where, data }: any) => {
      const sub = mockNewsletterSubscriptions.find(s => s.email === where.email)
      return sub ? { ...sub, ...data } : null
    },
  },
}
