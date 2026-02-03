// Mock data for demo deployment without database

export const mockUsers = [
  {
    id: 'user1',
    name: 'Demo Student',
    email: 'student@demo.com',
    phone: '+1234567890',
    role: 'user',
    image: null,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@demo.com',
    phone: null,
    role: 'admin',
    image: null,
    createdAt: new Date('2024-01-01'),
  },
]

export const mockCourses = [
  {
    id: 'course1',
    title: 'Vietnamese for Absolute Beginners',
    description: 'Start your Vietnamese learning journey from scratch. Learn basic greetings, pronunciation, and essential vocabulary to help you communicate in everyday situations.',
    instructor: 'POV Vietnamese',
    instructorBio: 'Native Vietnamese speaker with 5+ years of teaching experience',
    thumbnail: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
    price: 49.99,
    duration: '8 weeks',
    level: 'BEGINNER',
    category: 'Language Learning',
    whatYouWillLearn: [
      'Master Vietnamese pronunciation and tones',
      'Build a foundation of 500+ essential words',
      'Construct basic sentences for everyday conversations',
      'Understand Vietnamese culture and customs'
    ],
    requirements: [
      'No prior Vietnamese knowledge required',
      'Commitment to practice 30 minutes daily',
      'Notebook for taking notes'
    ],
    isPublished: true,
    studentCount: 127,
    rating: 4.8,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'course2',
    title: 'Intermediate Vietnamese Conversation',
    description: 'Take your Vietnamese to the next level with intermediate grammar, expanded vocabulary, and real-world conversation practice.',
    instructor: 'POV Vietnamese',
    instructorBio: 'Native Vietnamese speaker with 5+ years of teaching experience',
    thumbnail: 'https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?w=800',
    price: 79.99,
    duration: '10 weeks',
    level: 'INTERMEDIATE',
    category: 'Language Learning',
    whatYouWillLearn: [
      'Master complex sentence structures',
      'Expand vocabulary to 1500+ words',
      'Practice real-world conversations',
      'Understand regional dialects and slang'
    ],
    requirements: [
      'Completed beginner level or equivalent',
      'Basic understanding of Vietnamese tones',
      'Willingness to practice speaking'
    ],
    isPublished: true,
    studentCount: 89,
    rating: 4.9,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'course3',
    title: 'Advanced Vietnamese & Culture',
    description: 'Achieve fluency with advanced Vietnamese, literary texts, and deep cultural understanding.',
    instructor: 'POV Vietnamese',
    instructorBio: 'Native Vietnamese speaker with 5+ years of teaching experience',
    thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    price: 99.99,
    duration: '12 weeks',
    level: 'ADVANCED',
    category: 'Language Learning',
    whatYouWillLearn: [
      'Read Vietnamese literature and news',
      'Write formal and informal Vietnamese',
      'Understand idioms and proverbs',
      'Navigate professional Vietnamese environments'
    ],
    requirements: [
      'Intermediate Vietnamese proficiency',
      'Ability to hold basic conversations',
      'Interest in Vietnamese culture and literature'
    ],
    isPublished: true,
    studentCount: 45,
    rating: 5.0,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
]

export const mockModules = [
  {
    id: 'module1',
    courseId: 'course1',
    title: 'Introduction to Vietnamese',
    description: 'Get started with the basics of Vietnamese language and culture',
    order: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'module2',
    courseId: 'course1',
    title: 'Vietnamese Tones & Pronunciation',
    description: 'Master the 6 tones that are essential to Vietnamese',
    order: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'module3',
    courseId: 'course1',
    title: 'Essential Vocabulary',
    description: 'Learn the most common words and phrases',
    order: 3,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
]

export const mockLessons = [
  {
    id: 'lesson1',
    moduleId: 'module1',
    title: 'Welcome & Course Overview',
    description: 'Introduction to the course and what you will learn',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '5 minutes',
    order: 1,
    isFree: true,
    transcript: null,
    resources: null,
    notes: null,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'lesson2',
    moduleId: 'module1',
    title: 'The Vietnamese Alphabet',
    description: 'Learn the Vietnamese alphabet and basic pronunciation',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '12 minutes',
    order: 2,
    isFree: true,
    transcript: null,
    resources: null,
    notes: null,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'lesson3',
    moduleId: 'module1',
    title: 'Common Greetings',
    description: 'Practice essential Vietnamese greetings',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '10 minutes',
    order: 3,
    isFree: false,
    transcript: null,
    resources: null,
    notes: null,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'lesson4',
    moduleId: 'module2',
    title: 'Understanding the 6 Tones',
    description: 'Deep dive into Vietnamese tonal system',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '15 minutes',
    order: 1,
    isFree: false,
    transcript: null,
    resources: null,
    notes: null,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
]

export const mockBlogPosts = [
  {
    id: 'post1',
    title: '10 Tips for Learning Vietnamese Faster',
    slug: '10-tips-for-learning-vietnamese-faster',
    excerpt: 'Discover proven strategies to accelerate your Vietnamese learning journey and achieve fluency faster.',
    content: '<p>Learning Vietnamese can be challenging but rewarding...</p>',
    author: 'POV Vietnamese',
    category: 'Learning Tips',
    tags: ['learning', 'tips', 'beginners'],
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
    isPublished: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'post2',
    title: 'Vietnamese Culture: Understanding Family Terms',
    slug: 'vietnamese-culture-understanding-family-terms',
    excerpt: 'Family terms in Vietnamese are complex and beautiful. Learn how to address people correctly.',
    content: '<p>Vietnamese family terms reflect the culture...</p>',
    author: 'POV Vietnamese',
    category: 'Culture',
    tags: ['culture', 'family', 'vocabulary'],
    thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800',
    isPublished: true,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: 'post3',
    title: 'The Best Vietnamese Movies for Language Learners',
    slug: 'best-vietnamese-movies-for-language-learners',
    excerpt: 'Improve your Vietnamese by watching these engaging movies with authentic dialogue.',
    content: '<p>Watching movies is a fun way to learn...</p>',
    author: 'POV Vietnamese',
    category: 'Resources',
    tags: ['movies', 'resources', 'listening'],
    thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    isPublished: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
]

export const mockClassTypes = [
  {
    id: 'class1',
    name: 'One-on-One Private Lesson',
    description: 'Personalized Vietnamese lesson tailored to your goals and learning style',
    price: 35.00,
    duration: '60 minutes',
    maxStudents: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'class2',
    name: 'Small Group Class (2-4 students)',
    description: 'Learn Vietnamese in a small group setting with interactive activities',
    price: 20.00,
    duration: '90 minutes',
    maxStudents: 4,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'class3',
    name: 'Conversation Practice Session',
    description: 'Practice speaking Vietnamese with native speakers in a casual setting',
    price: 15.00,
    duration: '45 minutes',
    maxStudents: 6,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
]

export const mockCommunityThreads = [
  {
    id: 'thread1',
    userId: 'user1',
    title: 'How do you practice tones effectively?',
    content: 'I\'m struggling with the tones. What are your best tips for practicing and remembering them?',
    category: 'Learning Tips',
    isPinned: false,
    isLocked: false,
    views: 234,
    replyCount: 12,
    lastActivity: new Date('2024-02-03'),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-03'),
    user: mockUsers[0],
  },
  {
    id: 'thread2',
    userId: 'admin1',
    title: 'Welcome to the POV Vietnamese Community!',
    content: 'Introduce yourself and share your Vietnamese learning goals!',
    category: 'General',
    isPinned: true,
    isLocked: false,
    views: 567,
    replyCount: 45,
    lastActivity: new Date('2024-02-03'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-03'),
    user: mockUsers[1],
  },
  {
    id: 'thread3',
    userId: 'user1',
    title: 'Recommended Vietnamese podcasts?',
    content: 'Looking for good Vietnamese podcasts for intermediate learners. Any suggestions?',
    category: 'Resources',
    isPinned: false,
    isLocked: false,
    views: 189,
    replyCount: 8,
    lastActivity: new Date('2024-02-02'),
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-02-02'),
    user: mockUsers[0],
  },
]

export const mockEnrollments = [
  {
    id: 'enrollment1',
    userId: 'user1',
    courseId: 'course1',
    progress: 45,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-03'),
  },
]

export const mockNewsletterSubscriptions = [
  {
    id: 'sub1',
    email: 'subscriber1@example.com',
    name: 'John Doe',
    userId: 'user1',
    isActive: true,
    subscribedAt: new Date('2024-01-15'),
    unsubscribedAt: null,
  },
  {
    id: 'sub2',
    email: 'subscriber2@example.com',
    name: 'Jane Smith',
    userId: null,
    isActive: true,
    subscribedAt: new Date('2024-01-20'),
    unsubscribedAt: null,
  },
]

// Helper functions to simulate database queries
export function getMockCourses(options?: { isPublished?: boolean }) {
  if (options?.isPublished === undefined) {
    return mockCourses
  }
  return mockCourses.filter(c => c.isPublished === options.isPublished)
}

export function getMockCourse(id: string) {
  const course = mockCourses.find(c => c.id === id)
  if (!course) return null

  const modules = mockModules
    .filter(m => m.courseId === id)
    .map(module => ({
      ...module,
      lessons: mockLessons.filter(l => l.moduleId === module.id)
    }))

  return {
    ...course,
    modules
  }
}

export function getMockBlogPosts(options?: { isPublished?: boolean }) {
  if (options?.isPublished === undefined) {
    return mockBlogPosts
  }
  return mockBlogPosts.filter(p => p.isPublished === options.isPublished)
}

export function getMockBlogPost(slug: string) {
  return mockBlogPosts.find(p => p.slug === slug) || null
}

export function getMockCommunityThreads() {
  return mockCommunityThreads
}

export function getMockStats() {
  return {
    totalStudents: mockUsers.filter(u => u.role === 'user').length,
    totalCourses: mockCourses.length,
    totalEnrollments: mockEnrollments.length,
    totalRevenue: mockCourses.reduce((sum, c) => sum + (c.price * c.studentCount * 0.15), 0),
    recentBookings: 12,
    activeSubscribers: mockNewsletterSubscriptions.filter(s => s.isActive).length,
  }
}
