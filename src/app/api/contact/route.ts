import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

// Simple rate limiting (in production, use Redis or external service)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 3 // Max 3 submissions per 15 minutes

function getRateLimitKey(ip: string, email: string): string {
  return `${ip}:${email}`
}

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record) {
    rateLimitMap.set(key, { count: 1, timestamp: now })
    return false
  }

  // Reset if window has passed
  if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(key, { count: 1, timestamp: now })
    return false
  }

  // Check if limit exceeded
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }

  // Increment count
  record.count++
  return false
}

function validateContactData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long')
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required')
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      errors.push('Invalid email format')
    }
  }

  if (!data.subject || typeof data.subject !== 'string' || data.subject.trim().length < 5) {
    errors.push('Subject must be at least 5 characters long')
  }

  if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long')
  }

  // Check for potential spam
  const spamKeywords = ['viagra', 'casino', 'lottery', 'prize', 'winner', 'crypto', 'bitcoin']
  const fullText = `${data.subject} ${data.message}`.toLowerCase()
  if (spamKeywords.some(keyword => fullText.includes(keyword))) {
    errors.push('Message contains prohibited content')
  }

  return { isValid: errors.length === 0, errors }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const headersList = headers()
    const forwarded = headersList.get('x-forwarded-for')
    const clientIP = forwarded ? forwarded.split(',')[0] : 
                    headersList.get('x-real-ip') || 'unknown'

    // Parse request body
    const body = await request.json()
    const { name, email, subject, message }: ContactFormData = body

    // Validate input
    const { isValid, errors } = validateContactData(body)
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: errors },
        { status: 400 }
      )
    }

    // Rate limiting
    const rateLimitKey = getRateLimitKey(clientIP, email)
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many submissions. Please try again in 15 minutes.' 
        },
        { status: 429 }
      )
    }

    // TODO: In production, integrate with your email service (SendGrid, AWS SES, etc.)
    // For now, we'll simulate sending an email
    console.log('Contact form submission:', {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
      ip: clientIP
    })

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // In production, you might want to:
    // 1. Send an email to your support team
    // 2. Send a confirmation email to the user
    // 3. Store the message in a database
    // 4. Integrate with a CRM system

    // Example email integration (commented out):
    /*
    try {
      // Send notification email to support team
      await sendEmail({
        to: 'support@4speedmotorcycle.com',
        subject: `New Contact Form: ${subject}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
        `
      })

      // Send confirmation email to user
      await sendEmail({
        to: email,
        subject: 'Thank you for contacting 4Speed Motorcycle',
        html: `
          <h3>Thank you for your message!</h3>
          <p>Hi ${name},</p>
          <p>We've received your message and will get back to you within 24 hours.</p>
          <p><strong>Your message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p>Best regards,<br>4Speed Motorcycle Team</p>
        `
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Don't fail the request if email fails - log for manual follow-up
    }
    */

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.'
    })

  } catch (error) {
    console.error('Contact form error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error. Please try again later.' 
      },
      { status: 500 }
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}