import { PrismaClient } from '@prisma/client'
import { mockPrisma } from './prisma-mock'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use mock Prisma if DATABASE_URL is not set (for demo deployment)
const useMockData = !process.env.DATABASE_URL || process.env.USE_MOCK_DATA === 'true'

export const prisma = useMockData
  ? (mockPrisma as any)
  : (globalForPrisma.prisma ?? new PrismaClient())

if (process.env.NODE_ENV !== 'production' && !useMockData) {
  globalForPrisma.prisma = prisma
}

// Log mode for debugging
if (useMockData) {
  console.log('🎭 Using mock data (no database required)')
} else {
  console.log('🗄️  Using real database')
}
