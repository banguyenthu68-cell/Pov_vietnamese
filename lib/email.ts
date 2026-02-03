import { Resend } from 'resend'

// Use mock email if API key is not set (for demo deployment)
const useMockEmail = !process.env.RESEND_API_KEY || process.env.USE_MOCK_DATA === 'true'

const resend = useMockEmail ? null : new Resend(process.env.RESEND_API_KEY)

const fromEmail = process.env.EMAIL_FROM || 'POV Vietnamese <noreply@povvietnamese.com>'

if (useMockEmail) {
  console.log('📧 Using mock email service (no real emails will be sent)')
}

export interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  // Use mock email in demo mode
  if (useMockEmail || !resend) {
    console.log(`📧 Mock Email: ${subject} to ${to}`)
    return { success: true, data: { id: `mock_${Date.now()}` } }
  }

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    })
    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

// Newsletter welcome email
export async function sendWelcomeEmail(email: string, name?: string) {
  const displayName = name || 'there'

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Xin chào, ${displayName}! 👋</h1>
            <p>Welcome to POV Vietnamese</p>
          </div>
          <div class="content">
            <p>Thank you for subscribing to our newsletter!</p>
            <p>You'll receive:</p>
            <ul>
              <li>📚 Weekly Vietnamese learning tips</li>
              <li>🎥 New course announcements</li>
              <li>💡 Cultural insights and stories</li>
              <li>🎉 Exclusive offers and discounts</li>
            </ul>
            <p>Follow along on Instagram for daily content and community updates:</p>
            <a href="https://instagram.com/pov_vietnamese" class="button">Follow @pov_vietnamese</a>
            <p>Ready to start learning? Check out our courses:</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses" class="button">Browse Courses</a>
          </div>
          <div class="footer">
            <p>POV Vietnamese - Learn Vietnamese with confidence</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/unsubscribe">Unsubscribe</a></p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: 'Xin chào! Welcome to POV Vietnamese 🇻🇳',
    html,
  })
}

// Class booking confirmation email
export async function sendBookingConfirmationEmail(
  email: string,
  name: string,
  className: string,
  date: Date,
  time: string
) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .booking-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #667eea; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Class Booking Confirmed! 🎉</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Your class booking has been confirmed. We're excited to see you in class!</p>

            <div class="booking-details">
              <div class="detail-row">
                <span class="detail-label">Class:</span>
                <span>${className}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span>${formattedDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span>${time}</span>
              </div>
            </div>

            <p><strong>What to prepare:</strong></p>
            <ul>
              <li>📱 A stable internet connection</li>
              <li>📝 Notebook and pen for taking notes</li>
              <li>🎧 Headphones for better audio quality</li>
              <li>😊 A positive attitude and willingness to learn!</li>
            </ul>

            <p>You'll receive a meeting link 24 hours before the class.</p>

            <a href="${process.env.NEXT_PUBLIC_APP_URL}/classes" class="button">View My Bookings</a>
          </div>
          <div class="footer">
            <p>POV Vietnamese - Learn Vietnamese with confidence</p>
            <p>Questions? Reply to this email or DM us on Instagram @pov_vietnamese</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Class Booking Confirmed: ${className}`,
    html,
  })
}

// Course enrollment confirmation email
export async function sendEnrollmentConfirmationEmail(
  email: string,
  userName: string,
  courseName: string,
  courseId: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .course-card { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Your Course! 🎓</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Congratulations! You've successfully enrolled in:</p>

            <div class="course-card">
              <h2>${courseName}</h2>
              <p>Your learning journey starts now!</p>
            </div>

            <p><strong>Getting Started:</strong></p>
            <ul>
              <li>🎥 Access all course videos and materials</li>
              <li>📚 Follow the structured curriculum at your own pace</li>
              <li>✅ Track your progress as you complete lessons</li>
              <li>💬 Join our community forum for discussions and support</li>
            </ul>

            <p><strong>Pro Tips:</strong></p>
            <ul>
              <li>Set aside dedicated time each day for consistent practice</li>
              <li>Don't rush - understanding is more important than speed</li>
              <li>Use the community forum to ask questions and connect with other learners</li>
              <li>Practice speaking out loud, even when watching videos</li>
            </ul>

            <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}" class="button">Start Learning Now</a>
          </div>
          <div class="footer">
            <p>POV Vietnamese - Learn Vietnamese with confidence</p>
            <p>Need help? Reply to this email or DM us on Instagram @pov_vietnamese</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `You're enrolled: ${courseName}`,
    html,
  })
}

// Admin notification for new booking
export async function sendAdminBookingNotification(
  bookingDetails: {
    userName: string
    userEmail: string
    className: string
    date: Date
    time: string
    phone?: string
    message?: string
  }
) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(bookingDetails.date)

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #667eea; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
          .detail-row { padding: 10px; border-bottom: 1px solid #ddd; }
          .label { font-weight: bold; color: #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🔔 New Class Booking</h2>
          </div>
          <div class="content">
            <div class="detail-row">
              <span class="label">Student Name:</span> ${bookingDetails.userName}
            </div>
            <div class="detail-row">
              <span class="label">Email:</span> ${bookingDetails.userEmail}
            </div>
            ${bookingDetails.phone ? `<div class="detail-row"><span class="label">Phone:</span> ${bookingDetails.phone}</div>` : ''}
            <div class="detail-row">
              <span class="label">Class:</span> ${bookingDetails.className}
            </div>
            <div class="detail-row">
              <span class="label">Date:</span> ${formattedDate}
            </div>
            <div class="detail-row">
              <span class="label">Time:</span> ${bookingDetails.time}
            </div>
            ${bookingDetails.message ? `<div class="detail-row"><span class="label">Message:</span> ${bookingDetails.message}</div>` : ''}
          </div>
        </div>
      </body>
    </html>
  `

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@povvietnamese.com'

  return sendEmail({
    to: adminEmail,
    subject: `New Booking: ${bookingDetails.className} - ${bookingDetails.userName}`,
    html,
  })
}
