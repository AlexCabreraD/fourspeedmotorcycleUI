import { createElement } from 'react'
import { Resend } from 'resend'

import ContactFormEmail from '@/components/emails/contact-form-email'
import OrderConfirmationEmail from '@/components/emails/order-confirmation-email'
import ShippingNotificationEmail from '@/components/emails/shipping-notification-email'

export interface EmailTemplate {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  react?: React.ReactElement
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface OrderConfirmationData {
  customerName: string
  customerEmail: string
  orderNumber: string
  orderTotal: string
  items: Array<{
    name: string
    quantity: number
    price: string
  }>
}

export interface ShippingNotificationData {
  customerName: string
  customerEmail: string
  orderNumber: string
  trackingNumber: string
  carrier: string
  estimatedDelivery?: string
}

const resend = new Resend(process.env.RESEND_API_KEY)

export class EmailService {
  private static instance: EmailService
  private fromEmail: string
  private contactEmail: string

  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || 'Four Speed Motorcycle <onboarding@resend.dev>'
    this.contactEmail = process.env.CONTACT_EMAIL || 'support@4speedmotorcycle.com'

    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is required')
    }
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  async sendEmail(
    template: EmailTemplate
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const emailData: any = {
        from: this.fromEmail,
        to: Array.isArray(template.to) ? template.to : [template.to],
        subject: template.subject,
      }

      if (template.html) {
        emailData.html = template.html
      }
      if (template.text) {
        emailData.text = template.text
      }
      if (template.react) {
        emailData.react = template.react
      }

      const result = await resend.emails.send(emailData)

      if (result.error) {
        console.error('Email send error:', result.error)
        return { success: false, error: result.error.message }
      }

      return { success: true, messageId: result.data?.id }
    } catch (error) {
      console.error('Email service error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  async sendContactFormEmail(
    data: ContactFormData
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const subject = `Contact Form: ${data.subject}`

    const emailComponent = createElement(ContactFormEmail, {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    })

    return this.sendEmail({
      to: this.contactEmail,
      subject,
      react: emailComponent,
    })
  }

  async sendOrderConfirmationEmail(
    data: OrderConfirmationData
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const subject = `Order Confirmation - ${data.orderNumber}`

    const emailComponent = createElement(OrderConfirmationEmail, {
      customerName: data.customerName,
      orderNumber: data.orderNumber,
      orderTotal: data.orderTotal,
      items: data.items,
    })

    return this.sendEmail({
      to: data.customerEmail,
      subject,
      react: emailComponent,
    })
  }

  async sendShippingNotificationEmail(
    data: ShippingNotificationData
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const subject = `Your Order Has Shipped - ${data.orderNumber}`

    const emailComponent = createElement(ShippingNotificationEmail, {
      customerName: data.customerName,
      orderNumber: data.orderNumber,
      trackingNumber: data.trackingNumber,
      carrier: data.carrier,
      estimatedDelivery: data.estimatedDelivery || '',
    })

    return this.sendEmail({
      to: data.customerEmail,
      subject,
      react: emailComponent,
    })
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await resend.emails.send({
        from: this.fromEmail,
        to: this.contactEmail,
        subject: 'Email Service Test',
        html: '<p>This is a test email to verify the email service is working.</p>',
      })

      if (result.error) {
        return { success: false, error: result.error.message }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection test failed',
      }
    }
  }
}

export const emailService = EmailService.getInstance()

export type {
  ContactFormData as ContactFormDataType,
  EmailTemplate as EmailTemplateType,
  OrderConfirmationData as OrderConfirmationDataType,
  ShippingNotificationData as ShippingNotificationDataType,
}
