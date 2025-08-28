import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'usd', metadata = {} } = await request.json()

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never', // Keeps the flow on your site
      },
      metadata: {
        source: 'fourspeed_motorcycle_shop',
        ...metadata,
      },
    })

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error: any) {
    console.error('Payment Intent Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create payment intent',
      },
      { status: 500 }
    )
  }
}
