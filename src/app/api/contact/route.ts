import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { type ContactFormData, emailService } from '@/lib/services/email-service'

const rateLimitMap = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 3

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

  if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(key, { count: 1, timestamp: now })
    return false
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }

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

  const spamKeywords = ['viagra', 'casino', 'lottery', 'prize', 'winner', 'crypto', 'bitcoin']
  const fullText = `${data.subject} ${data.message}`.toLowerCase()
  if (spamKeywords.some((keyword) => fullText.includes(keyword))) {
    errors.push('Message contains prohibited content')
  }

  return { isValid: errors.length === 0, errors }
}

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers()
    const forwarded = headersList.get('x-forwarded-for')
    const clientIP = forwarded ? forwarded.split(',')[0] : headersList.get('x-real-ip') || 'unknown'

    const body = await request.json()
    const { name, email, subject, message }: ContactFormData = body

    const { isValid, errors } = validateContactData(body)
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: errors },
        { status: 400 }
      )
    }

    const rateLimitKey = getRateLimitKey(clientIP, email)
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many submissions. Please try again in 15 minutes.',
        },
        { status: 429 }
      )
    }

    try {
      const emailResult = await emailService.sendContactFormEmail({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      })

      if (!emailResult.success) {
        console.error('Email sending failed:', emailResult.error)
        console.warn('Contact form data for manual processing:', {
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          timestamp: new Date().toISOString(),
          ip: clientIP,
          emailError: emailResult.error,
        })
      } else {
      }
    } catch (emailError) {
      console.error('Email service error:', emailError)
      console.warn('Contact form data for manual processing:', {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        timestamp: new Date().toISOString(),
        ip: clientIP,
        error: emailError,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
    })
  } catch (error) {
    console.error('Contact form error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error. Please try again later.',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
