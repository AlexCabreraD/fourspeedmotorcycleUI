import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

// POST: Associate sample PO numbers with current user for testing
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get sample PO numbers from request or use defaults
    let requestBody
    try {
      requestBody = await request.json()
    } catch (e) {
      requestBody = {}
    }
    
    const { poNumbers } = requestBody
    const testPoNumbers = poNumbers || [
      // Add some sample PO numbers that might exist in your WPS test data
      '240001', '240002', '240003', 'TEST-001', 'TEST-002'
    ]

    // Get the current user
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    
    // Get existing PO numbers from metadata
    const existingPoNumbers = user.privateMetadata?.orderPoNumbers as string[] || []
    
    // Merge new PO numbers with existing ones (remove duplicates)
    const allPoNumbers = Array.from(new Set([...existingPoNumbers, ...testPoNumbers]))
    
    // Update user metadata
    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        ...user.privateMetadata,
        orderPoNumbers: allPoNumbers
      }
    })
    
    return NextResponse.json({ 
      success: true,
      message: `Associated ${testPoNumbers.length} PO numbers with user`,
      poNumbers: allPoNumbers
    })
  } catch (error) {
    console.error('Error associating test orders with user:', error)
    console.error('Error details:', error)
    return NextResponse.json(
      { 
        error: 'Failed to associate test orders with user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE: Clear all PO numbers for current user (for testing)
export async function DELETE() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the current user
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    
    // Clear PO numbers from metadata
    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        ...user.privateMetadata,
        orderPoNumbers: []
      }
    })
    
    return NextResponse.json({ 
      success: true,
      message: 'Cleared all PO numbers for user'
    })
  } catch (error) {
    console.error('Error clearing user orders:', error)
    return NextResponse.json(
      { error: 'Failed to clear user orders' },
      { status: 500 }
    )
  }
}