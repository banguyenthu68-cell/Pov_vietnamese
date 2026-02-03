# Deployment Guide for Vercel

This project is configured to run with **mock data** so you can deploy it without needing a real database or API keys.

## Quick Deploy to Vercel (Recommended)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # Create a new repository on GitHub and push
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add these environment variables:
     ```
     USE_MOCK_DATA=true
     NEXTAUTH_SECRET=demo-secret-key-change-in-production
     NEXTAUTH_URL=https://your-deployment-url.vercel.app
     ```
   - Click "Deploy"

3. **After deployment:**
   - Vercel will give you a URL like `https://your-project.vercel.app`
   - Update `NEXTAUTH_URL` in the environment variables to match your actual URL
   - Redeploy if needed

### Option 2: Deploy via Vercel CLI

1. **Login to Vercel:**
   ```bash
   npx vercel login
   ```

2. **Deploy:**
   ```bash
   npx vercel --prod
   ```

3. **Set environment variables:**
   ```bash
   npx vercel env add USE_MOCK_DATA production
   # Enter: true

   npx vercel env add NEXTAUTH_SECRET production
   # Enter: demo-secret-key-change-in-production

   npx vercel env add NEXTAUTH_URL production
   # Enter: your deployment URL
   ```

## Environment Variables

For **mock/demo deployment** (no database needed), use these:

```env
USE_MOCK_DATA=true
NEXTAUTH_SECRET=demo-secret-key-change-in-production
NEXTAUTH_URL=https://your-deployment-url.vercel.app
```

For **production deployment** (with real services):

```env
# Database
DATABASE_URL=your-database-url

# Email (Resend)
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Payment (Stripe)
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Authentication
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=https://your-production-url.com
```

## Mock Data Features

When `USE_MOCK_DATA=true` or when required API keys are missing:

- ✅ All pages load and function
- ✅ Mock database with sample courses, users, and content
- ✅ Mock email sending (logs to console instead)
- ✅ Mock Stripe payments (simulated success)
- ✅ No external services required

### Mock Users

- **Student Account:**
  - Email: student@example.com
  - Name: Demo Student

- **Admin Account:**
  - Email: admin@example.com
  - Name: Admin User

### Mock Content

- 3 Vietnamese language courses
- 3 class types for booking
- 3 community forum threads
- 3 blog posts
- 2 newsletter subscribers

## Testing the Deployment

Once deployed, you can:

1. Browse courses at `/courses`
2. View community forum at `/community`
3. Read blog posts at `/blog`
4. Access admin dashboard at `/admin` (mock admin user)
5. Test booking classes
6. Test newsletter subscription

All features work without requiring actual database or API keys!

## Troubleshooting

### Build fails on Vercel

- Make sure you're using Node.js 18.x or higher
- Check that all dependencies are in `package.json`
- Ensure Prisma schema is valid

### Pages show errors

- Verify `USE_MOCK_DATA=true` is set in environment variables
- Check deployment logs for specific errors
- Make sure `NEXTAUTH_URL` matches your actual deployment URL

### Authentication issues

- Update `NEXTAUTH_URL` to match your Vercel deployment URL
- Regenerate `NEXTAUTH_SECRET` using: `openssl rand -base64 32`

## Performance

The mock data version:
- ✅ Loads instantly (no database queries)
- ✅ No cold starts from database connections
- ✅ Perfect for demos and testing
- ✅ Can handle any traffic level

## Converting to Production

To switch from mock to real data:

1. Set up a database (PostgreSQL recommended)
2. Add `DATABASE_URL` environment variable
3. Remove `USE_MOCK_DATA` or set it to `false`
4. Run Prisma migrations: `npx prisma migrate deploy`
5. Add real API keys for Resend and Stripe
6. Update `NEXTAUTH_SECRET` with a secure random string

The application will automatically detect the environment variables and switch from mock to real services!
