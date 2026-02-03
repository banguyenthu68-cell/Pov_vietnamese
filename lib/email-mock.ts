// Mock email service for demo deployment

export async function sendEmail({ to, subject, html }: any) {
  console.log('📧 Mock Email Sent:')
  console.log(`  To: ${to}`)
  console.log(`  Subject: ${subject}`)
  console.log(`  (Email content not sent in demo mode)`)
  return { success: true, data: { id: `mock_${Date.now()}` } }
}

export async function sendWelcomeEmail(email: string, name?: string) {
  console.log(`📧 Welcome email would be sent to: ${email} (${name || 'there'})`)
  return { success: true, data: { id: `mock_${Date.now()}` } }
}

export async function sendBookingConfirmationEmail(
  email: string,
  name: string,
  className: string,
  date: Date,
  time: string
) {
  console.log(`📧 Booking confirmation would be sent to: ${email}`)
  console.log(`  Class: ${className}`)
  console.log(`  Date: ${date.toLocaleDateString()}`)
  return { success: true, data: { id: `mock_${Date.now()}` } }
}

export async function sendEnrollmentConfirmationEmail(
  email: string,
  userName: string,
  courseName: string,
  courseId: string
) {
  console.log(`📧 Enrollment confirmation would be sent to: ${email}`)
  console.log(`  Course: ${courseName}`)
  return { success: true, data: { id: `mock_${Date.now()}` } }
}

export async function sendAdminBookingNotification(bookingDetails: any) {
  console.log(`📧 Admin notification would be sent`)
  console.log(`  Student: ${bookingDetails.userName}`)
  console.log(`  Class: ${bookingDetails.className}`)
  return { success: true, data: { id: `mock_${Date.now()}` } }
}
