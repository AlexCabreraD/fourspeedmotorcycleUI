import { clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import { createWPSClient } from '@/lib/api/wps-client'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not defined in environment variables')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error('Webhook signature verification failed:', errorMessage)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.warn('✅ Payment succeeded:', paymentIntent.id)

        try {
          const metadata = paymentIntent.metadata

          if (!metadata.orderId) {
            console.error('Payment intent missing orderId in metadata')
            break
          }

          const cartItems = metadata.items ? JSON.parse(metadata.items) : []

          if (cartItems.length === 0) {
            console.error('Payment intent has no items')
            break
          }

          const wpsClient = createWPSClient()

          const orderData = {
            customerInfo: {
              clerkUserId: metadata.clerkUserId || 'guest',
              email: metadata.customerEmail || '',
              name: metadata.customerName || 'Guest Customer',
              phone: metadata.customerPhone || '',
            },
            shippingInfo: {
              name: metadata.customerName || 'Guest Customer',
              address1: metadata.shippingAddress || '',
              address2: metadata.shippingAddress2 || '',
              city: metadata.shippingCity || '',
              state: metadata.shippingState || '',
              zipCode: metadata.shippingZip || '',
              phone: metadata.shippingPhone || metadata.customerPhone || '',
            },
            cartItems: cartItems,
            paymentIntentId: paymentIntent.id,
            totalAmount: paymentIntent.amount / 100, // Convert from cents
          }

          const wpsOrderResponse = await wpsClient.createOrderFromStripePayment(orderData)

          console.warn('✅ WPS Order created successfully:', wpsOrderResponse.data.po_number)

          if (
            orderData.customerInfo.clerkUserId &&
            orderData.customerInfo.clerkUserId !== 'guest'
          ) {
            try {
              const client = await clerkClient()
              const user = await client.users.getUser(orderData.customerInfo.clerkUserId)

              const existingOrders = (user.privateMetadata?.orderPoNumbers as string[]) || []

              const updatedOrders = [
                ...existingOrders,
                wpsOrderResponse.data.po_number || `FS_${Date.now()}`,
              ]

              await client.users.updateUserMetadata(orderData.customerInfo.clerkUserId, {
                privateMetadata: {
                  ...user.privateMetadata,
                  orderPoNumbers: updatedOrders,
                  lastOrderDate: new Date().toISOString(),
                  totalOrders: updatedOrders.length,
                },
              })

              console.warn(
                '✅ Updated Clerk user metadata with order PO number:',
                wpsOrderResponse.data.po_number
              )
            } catch (clerkError) {
              console.error('Failed to update Clerk user metadata:', clerkError)
            }
          }

        } catch (error) {
          console.error('Failed to create WPS order:', error)
        }

        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        console.warn('❌ Payment failed:', failedPayment.id)


        break

      case 'charge.dispute.created':
        const dispute = event.data.object as Stripe.Dispute
        console.warn('⚠️ Dispute created:', dispute.id)


        break

      default:
        console.warn(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Webhook processing failed'
    console.error('Webhook Error:', error)

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
