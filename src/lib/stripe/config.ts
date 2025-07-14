import { loadStripe } from '@stripe/stripe-js'

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined in environment variables')
}

// Initialize Stripe with your publishable key
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

// Stripe appearance configuration
export const stripeAppearance = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#2563eb', // primary-600
    colorBackground: '#ffffff',
    colorText: '#1f2937', // steel-800
    colorDanger: '#dc2626', // red-600
    fontFamily: 'Inter, system-ui, sans-serif',
    spacingUnit: '4px',
    borderRadius: '8px',
  },
  rules: {
    '.Input': {
      borderColor: '#d1d5db', // steel-300
      borderRadius: '8px',
    },
    '.Input:focus': {
      borderColor: '#2563eb', // primary-600
      boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)',
    },
    '.Label': {
      fontWeight: '500',
      fontSize: '14px',
      color: '#374151', // steel-700
    },
  },
}

// Payment Element options
export const paymentElementOptions = {
  layout: 'tabs' as const,
  paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
  fields: {
    billingDetails: {
      name: 'auto',
      email: 'auto',
      phone: 'auto',
      address: 'auto',
    },
  },
  wallets: {
    applePay: 'auto',
    googlePay: 'auto',
  },
}

export interface PaymentIntentData {
  amount: number
  currency?: string
  metadata?: Record<string, string>
}

export interface OrderMetadata {
  orderId?: string
  customerId?: string
  customerEmail?: string
  items?: string // JSON string of cart items
  shippingMethod?: string
}