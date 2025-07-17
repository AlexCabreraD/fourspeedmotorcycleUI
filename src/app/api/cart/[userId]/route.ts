import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: currentUserId } = await auth()
    
    // Ensure user can only access their own cart
    if (currentUserId !== params.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const client = await clerkClient()
    const user = await client.users.getUser(params.userId)
    
    const cart = user.publicMetadata?.cart || []
    
    return NextResponse.json({ cart })
  } catch (error) {
    console.error('Error fetching user cart:', error)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: currentUserId } = await auth()
    
    // Ensure user can only modify their own cart
    if (currentUserId !== params.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { cart } = await request.json()
    
    const client = await clerkClient()
    await client.users.updateUser(params.userId, {
      publicMetadata: {
        cart: cart
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving user cart:', error)
    return NextResponse.json({ error: 'Failed to save cart' }, { status: 500 })
  }
}