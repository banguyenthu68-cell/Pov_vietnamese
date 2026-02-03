import Stripe from 'stripe'

// Use mock Stripe if API key is not set (for demo deployment)
const useMockStripe = !process.env.STRIPE_SECRET_KEY || process.env.USE_MOCK_DATA === 'true'

// Mock Stripe client for demo
const mockStripe = {
  checkout: {
    sessions: {
      create: async (params: any) => ({
        id: `cs_mock_${Date.now()}`,
        url: `/checkout/success?session_id=cs_mock_${Date.now()}`,
        payment_status: 'paid',
        metadata: params.metadata
      }),
      retrieve: async (sessionId: string) => ({
        id: sessionId,
        payment_status: 'paid',
        metadata: {
          userId: 'user1',
          courseId: 'course1'
        }
      })
    }
  },
  webhooks: {
    constructEvent: (body: any, signature: string, secret: string) => ({
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_mock',
          payment_status: 'paid',
          metadata: {
            userId: 'user1',
            courseId: 'course1'
          }
        }
      }
    })
  }
} as any

export const stripe = useMockStripe
  ? mockStripe
  : new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-12-18.acacia',
      typescript: true
    })

if (useMockStripe) {
  console.log('💳 Using mock Stripe (no real payments will be processed)')
}
