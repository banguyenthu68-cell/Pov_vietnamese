# POV Vietnamese - Language Learning Platform

A comprehensive Vietnamese language learning platform built with Next.js, featuring video courses, class bookings, community forum, and email newsletter functionality.

## Features

### 1. **Landing Page & Blog**
- Modern, responsive landing page with hero section
- Blog system for sharing learning tips and cultural insights
- Newsletter subscription with welcome emails

### 2. **Video Course Platform**
- Course catalog with filtering by level
- Structured courses with modules and lessons
- Video player with progress tracking
- Free preview lessons
- Stripe payment integration for course enrollment
- Automatic enrollment confirmation emails

### 3. **Class Booking System**
- One-on-one and group class scheduling
- Available time slots
- Booking confirmation emails (student + admin notification)
- Booking management dashboard

### 4. **Community Forum**
- Discussion threads with categories
- Replies and nested conversations
- Like system for helpful replies
- Pinned and locked threads
- Search functionality

### 5. **Email Marketing**
- Newsletter subscription management
- Automated welcome emails
- Newsletter composer for admin
- Personalized email templates
- Test mode for email previews

### 6. **Admin Dashboard**
- Overview statistics
- Course management (create, edit, publish)
- Blog post management
- Newsletter composer
- Booking and student management
- Revenue tracking

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Email**: Resend
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, canvas-confetti

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Stripe account
- Resend account (for emails)

### 2. Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pov_vietnamese"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Email (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="POV Vietnamese <noreply@povvietnamese.com>"
ADMIN_EMAIL="admin@povvietnamese.com"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

### 4. Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The application will be available at `http://localhost:3000`

### 5. Stripe Webhook Setup

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login to Stripe CLI: `stripe login`
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Copy the webhook signing secret to your `.env` file as `STRIPE_WEBHOOK_SECRET`

For production, register your webhook endpoint in the Stripe Dashboard:
- URL: `https://yourdomain.com/api/webhooks/stripe`
- Events to listen for: `checkout.session.completed`, `payment_intent.payment_failed`

## Project Structure

```
pov-vietnamese/
├── app/
│   ├── admin/              # Admin dashboard pages
│   │   ├── blog/           # Blog management
│   │   ├── courses/        # Course management
│   │   └── newsletter/     # Newsletter composer
│   ├── api/                # API routes
│   │   ├── admin/          # Admin endpoints
│   │   ├── blog/           # Blog CRUD
│   │   ├── bookings/       # Class booking
│   │   ├── checkout/       # Stripe checkout
│   │   ├── community/      # Forum threads & replies
│   │   ├── courses/        # Course CRUD
│   │   ├── enrollments/    # Course enrollments
│   │   ├── newsletter/     # Newsletter subscription
│   │   └── webhooks/       # Stripe webhooks
│   ├── auth/               # Authentication pages
│   ├── blog/               # Public blog pages
│   ├── classes/            # Class booking pages
│   ├── community/          # Forum pages
│   ├── courses/            # Course pages
│   └── checkout/           # Checkout flow
├── components/             # Reusable React components
├── lib/                    # Utility functions
│   ├── auth.ts             # NextAuth configuration
│   ├── email.ts            # Email templates & sending
│   ├── prisma.ts           # Prisma client
│   └── stripe.ts           # Stripe client
├── prisma/
│   └── schema.prisma       # Database schema
└── public/                 # Static assets
```

## Database Models

- **User**: User accounts with authentication
- **Course**: Video courses with pricing
- **Module**: Course modules (grouping lessons)
- **Lesson**: Individual video lessons
- **Enrollment**: Student course enrollments
- **LessonProgress**: Track lesson completion
- **ClassType**: Types of classes offered
- **Booking**: Class bookings
- **BlogPost**: Blog articles
- **NewsletterSubscription**: Email subscribers
- **CommunityThread**: Forum discussion threads
- **CommunityReply**: Thread replies
- **ReplyLike**: Likes on replies

## Key Features Implementation

### Stripe Payment Flow

1. User selects a course and clicks "Enroll Now"
2. Frontend calls `/api/checkout` with courseId
3. Backend creates Stripe checkout session with metadata (userId, courseId)
4. User is redirected to Stripe hosted checkout page
5. After payment, Stripe redirects to success page with session_id
6. Success page calls `/api/checkout/verify` to confirm payment
7. Stripe webhook (`/api/webhooks/stripe`) creates enrollment and sends confirmation email

### Email System

- **Welcome Email**: Sent when user subscribes to newsletter
- **Booking Confirmation**: Sent to student and admin when class is booked
- **Enrollment Confirmation**: Sent when user enrolls in a course
- **Newsletter**: Admin can send custom newsletters to all subscribers

### Course Progress Tracking

- Progress automatically calculated based on completed lessons
- Lessons can be marked as free preview (accessible without enrollment)
- Video player tracks completion status
- Progress displayed on course detail page

## TODO / Future Enhancements

- [ ] Video hosting integration (Vimeo, YouTube, or Cloudflare Stream)
- [ ] Admin role enforcement (currently TODOs in code)
- [ ] Quiz and assessment system
- [ ] Certificates of completion
- [ ] Live class integration (Zoom, Google Meet)
- [ ] Student dashboard with analytics
- [ ] Course reviews and ratings
- [ ] Referral program
- [ ] Mobile app (React Native)

## Support

For questions or issues:
- Instagram: [@pov_vietnamese](https://instagram.com/pov_vietnamese)
- Email: admin@povvietnamese.com

## License

Private project - All rights reserved
