import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const wishlist = user.privateMetadata?.wishlist || []

    return NextResponse.json({
      success: true,
      wishlist
    })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { wishlist } = body

    if (!Array.isArray(wishlist)) {
      return NextResponse.json(
        { error: 'Wishlist must be an array' },
        { status: 400 }
      )
    }

    const client = await clerkClient()
    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        wishlist
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Wishlist saved successfully'
    })
  } catch (error) {
    console.error('Error saving wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to save wishlist' },
      { status: 500 }
    )
  }
}