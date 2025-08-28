import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

import { createWPSClient } from '@/lib/api/wps-client'

// GET: Retrieve user's orders with full details from WPS
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the current user
    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    // Get user's PO numbers from metadata
    const orderPoNumbers = (user.privateMetadata?.orderPoNumbers as string[]) || []

    if (orderPoNumbers.length === 0) {
      return NextResponse.json({
        success: true,
        orders: [],
        meta: {
          totalOrders: 0,
          lastOrderDate: null,
        },
      })
    }

    // Fetch order details from WPS for each PO number
    const wpsClient = createWPSClient()
    const orderPromises = orderPoNumbers.map(async (poNumber) => {
      try {
        const orderResponse = await wpsClient.getOrder(poNumber)
        return {
          poNumber,
          ...orderResponse.data,
          status: 'found',
        }
      } catch (error) {
        console.error(`Failed to fetch order ${poNumber}:`, error)
        return {
          poNumber,
          status: 'not_found',
          error: 'Order not found in WPS system',
        }
      }
    })

    const orders = await Promise.all(orderPromises)

    // Sort orders by date (newest first)
    const sortedOrders = orders.sort((a, b) => {
      if (a.order_date && b.order_date) {
        return new Date(b.order_date).getTime() - new Date(a.order_date).getTime()
      }
      return 0
    })

    return NextResponse.json({
      success: true,
      orders: sortedOrders,
      meta: {
        totalOrders: orderPoNumbers.length,
        lastOrderDate: user.privateMetadata?.lastOrderDate || null,
        foundOrders: orders.filter((o) => o.status === 'found').length,
        notFoundOrders: orders.filter((o) => o.status === 'not_found').length,
      },
    })
  } catch (error) {
    console.error('Error retrieving user orders:', error)
    return NextResponse.json(
      {
        error: 'Failed to retrieve user orders',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// POST: Add a PO number to user's orders
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { poNumber } = await request.json()

    if (!poNumber) {
      return NextResponse.json({ error: 'PO number is required' }, { status: 400 })
    }

    // Get the current user
    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    // Get existing PO numbers from metadata (using privateMetadata like wishlist)
    const existingPoNumbers = (user.privateMetadata?.orderPoNumbers as string[]) || []

    // Add new PO number if it doesn't already exist
    if (!existingPoNumbers.includes(poNumber)) {
      const updatedPoNumbers = [...existingPoNumbers, poNumber]

      // Update user metadata (using updateUserMetadata like wishlist)
      await client.users.updateUserMetadata(userId, {
        privateMetadata: {
          ...user.privateMetadata,
          orderPoNumbers: updatedPoNumbers,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Order associated with user successfully',
    })
  } catch (error) {
    console.error('Error associating order with user:', error)
    return NextResponse.json({ error: 'Failed to associate order with user' }, { status: 500 })
  }
}
