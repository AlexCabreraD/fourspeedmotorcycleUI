import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

// GET: Retrieve user's order PO numbers
export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the current user
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    
    // Get user's PO numbers from metadata (using privateMetadata like wishlist)
    const userOrders = user.privateMetadata?.orderPoNumbers as string[] || []
    
    return NextResponse.json({ 
      success: true, 
      orderPoNumbers: userOrders 
    })
  } catch (error) {
    console.error('Error retrieving user orders:', error)
    console.error('Error details:', error)
    return NextResponse.json(
      { 
        error: 'Failed to retrieve user orders',
        details: error instanceof Error ? error.message : 'Unknown error'
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
      return NextResponse.json(
        { error: 'PO number is required' },
        { status: 400 }
      )
    }

    // Get the current user
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    
    // Get existing PO numbers from metadata (using privateMetadata like wishlist)
    const existingPoNumbers = user.privateMetadata?.orderPoNumbers as string[] || []
    
    // Add new PO number if it doesn't already exist
    if (!existingPoNumbers.includes(poNumber)) {
      const updatedPoNumbers = [...existingPoNumbers, poNumber]
      
      // Update user metadata (using updateUserMetadata like wishlist)
      await client.users.updateUserMetadata(userId, {
        privateMetadata: {
          ...user.privateMetadata,
          orderPoNumbers: updatedPoNumbers
        }
      })
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Order associated with user successfully'
    })
  } catch (error) {
    console.error('Error associating order with user:', error)
    return NextResponse.json(
      { error: 'Failed to associate order with user' },
      { status: 500 }
    )
  }
}