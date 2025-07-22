import { NextRequest, NextResponse } from 'next/server'
import { calculateShippingRates, estimatePackageWeight, validateShippingAddress, type ShippingAddress } from '@/lib/services/shipping'

export interface ShippingCalculationRequest {
  address: ShippingAddress
  items: Array<{
    id: number
    sku: string
    name: string
    quantity: number
    list_price: string
    weight?: number
    product_type?: string
  }>
  orderTotal?: number
}

export async function POST(request: NextRequest) {
  try {
    const body: ShippingCalculationRequest = await request.json()

    if (!body.address || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Address and items are required' },
        { status: 400 }
      )
    }

    // Validate address
    const addressValidation = validateShippingAddress(body.address)
    if (!addressValidation.valid) {
      return NextResponse.json(
        { 
          error: 'Invalid shipping address', 
          details: addressValidation.errors 
        },
        { status: 400 }
      )
    }

    // Calculate order total if not provided
    const orderTotal = body.orderTotal || body.items.reduce((total, item) => {
      return total + (parseFloat(item.list_price) * item.quantity)
    }, 0)

    // Estimate package weight
    const packageWeight = estimatePackageWeight(body.items)

    // Calculate shipping rates
    const shippingResult = calculateShippingRates(
      body.address,
      orderTotal,
      packageWeight
    )

    if (!shippingResult.success) {
      return NextResponse.json(
        { 
          error: 'Failed to calculate shipping rates',
          details: shippingResult.error
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      rates: shippingResult.rates,
      order_total: orderTotal,
      package_weight: packageWeight,
      free_shipping_threshold: 99.00,
      qualifies_for_free_shipping: orderTotal >= 99.00
    })

  } catch (error) {
    console.error('Shipping calculation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error calculating shipping',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}