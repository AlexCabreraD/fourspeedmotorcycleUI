// Simple zone-based shipping calculation for Four Speed Motorcycle Shop

export interface ShippingAddress {
  name: string
  street1: string
  street2?: string
  city: string
  state: string
  zip: string
  country?: string
  phone?: string
  email?: string
}

export interface ShippingRate {
  id: string
  service: string
  carrier: string
  rate: number
  delivery_days?: number
  delivery_date?: string
  delivery_date_guaranteed?: boolean
  est_delivery_days?: number
}

export interface ShippingCalculationResult {
  success: boolean
  rates: ShippingRate[]
  error?: string
}

// Shipping zones based on distance from Boise, ID warehouse
const SHIPPING_ZONES = {
  // Local zone: Same state and neighboring states
  local: {
    states: ['ID', 'WA', 'OR', 'MT', 'UT', 'WY'],
    groundRate: 8.95,
    expeditedRate: 16.95,
    groundDays: 2,
    expeditedDays: 1,
  },
  // Regional zone: Western states
  regional: {
    states: ['CA', 'NV', 'AZ', 'CO', 'NM', 'ND', 'SD'],
    groundRate: 12.95,
    expeditedRate: 22.95,
    groundDays: 4,
    expeditedDays: 2,
  },
  // National zone: All other states
  national: {
    states: ['*'], // Wildcard for all other states
    groundRate: 16.95,
    expeditedRate: 28.95,
    groundDays: 6,
    expeditedDays: 3,
  },
}

// Free shipping threshold
const FREE_SHIPPING_THRESHOLD = 99.00

/**
 * Calculate shipping rates based on destination and order value
 */
export function calculateShippingRates(
  address: ShippingAddress,
  orderTotal: number,
  orderWeight?: number
): ShippingCalculationResult {
  try {
    // Validate address
    if (!address.state || !address.zip) {
      return {
        success: false,
        rates: [],
        error: 'State and ZIP code are required'
      }
    }

    // Check for free shipping
    if (orderTotal >= FREE_SHIPPING_THRESHOLD) {
      return {
        success: true,
        rates: [{
          id: 'free-shipping',
          service: 'Free Ground Shipping',
          carrier: 'Standard',
          rate: 0,
          delivery_days: 5,
          est_delivery_days: 5,
        }]
      }
    }

    // Determine shipping zone
    const zone = getShippingZone(address.state)
    
    // Calculate rates for the zone
    const rates: ShippingRate[] = [
      {
        id: `${zone.name}-ground`,
        service: 'Ground Shipping',
        carrier: 'Standard',
        rate: zone.groundRate,
        delivery_days: zone.groundDays,
        est_delivery_days: zone.groundDays,
      },
      {
        id: `${zone.name}-expedited`,
        service: 'Expedited Shipping',
        carrier: 'Express',
        rate: zone.expeditedRate,
        delivery_days: zone.expeditedDays,
        est_delivery_days: zone.expeditedDays,
      }
    ]

    // Add weight surcharge for heavy items (over 50 lbs)
    if (orderWeight && orderWeight > 50) {
      const surcharge = Math.floor((orderWeight - 50) / 10) * 5 // $5 per 10 lbs over 50
      rates.forEach(rate => {
        if (rate.id !== 'free-shipping') {
          rate.rate += surcharge
        }
      })
    }

    return {
      success: true,
      rates: rates.sort((a, b) => a.rate - b.rate) // Sort by price
    }

  } catch (error) {
    return {
      success: false,
      rates: [],
      error: error instanceof Error ? error.message : 'Failed to calculate shipping'
    }
  }
}

/**
 * Get shipping zone based on state
 */
function getShippingZone(state: string) {
  const normalizedState = state.toUpperCase()
  
  if (SHIPPING_ZONES.local.states.includes(normalizedState)) {
    return { name: 'local', ...SHIPPING_ZONES.local }
  }
  
  if (SHIPPING_ZONES.regional.states.includes(normalizedState)) {
    return { name: 'regional', ...SHIPPING_ZONES.regional }
  }
  
  return { name: 'national', ...SHIPPING_ZONES.national }
}

/**
 * Estimate package weight based on cart items
 */
export function estimatePackageWeight(items: any[]): number {
  let totalWeight = 0
  
  for (const item of items) {
    // Use item weight if available, otherwise estimate based on product type
    const itemWeight = item.weight || estimateItemWeight(item)
    totalWeight += itemWeight * item.quantity
  }
  
  // Add packaging weight (2-4 lbs depending on order size)
  const packagingWeight = items.length > 5 ? 4 : items.length > 2 ? 3 : 2
  totalWeight += packagingWeight
  
  return Math.max(totalWeight, 1) // Minimum 1 lb
}

/**
 * Estimate weight for items without weight data (in pounds)
 */
function estimateItemWeight(item: any): number {
  const productType = item.product_type?.toLowerCase() || ''
  
  // Weight estimates in pounds based on common motorcycle parts
  const weightEstimates: Record<string, number> = {
    'accessories': 0.5,
    'air filters': 0.25,
    'batteries': 2.0,
    'brakes': 1.0,
    'chains': 1.5,
    'exhaust': 5.0,
    'gloves': 0.4,
    'helmets': 3.0,
    'oils': 1.0,
    'spark plugs': 0.1,
    'tires': 10.0,
    'tools': 0.75,
    'windshield': 1.25,
    'hardware': 0.1,
    'graphics': 0.1,
    'grips': 0.25,
    'levers': 0.5,
    'mirrors': 0.75,
    'footwear': 1.5,
    'apparel': 0.75,
    'protective': 1.0,
  }
  
  // Check if product type matches any category
  for (const [category, weight] of Object.entries(weightEstimates)) {
    if (productType.includes(category)) {
      return weight
    }
  }
  
  // Default weight for unknown items
  return 0.5
}

/**
 * Validate shipping address format
 */
export function validateShippingAddress(address: ShippingAddress): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (!address.name?.trim()) {
    errors.push('Name is required')
  }
  
  if (!address.street1?.trim()) {
    errors.push('Street address is required')
  }
  
  if (!address.city?.trim()) {
    errors.push('City is required')
  }
  
  if (!address.state?.trim()) {
    errors.push('State is required')
  }
  
  if (!address.zip?.trim()) {
    errors.push('ZIP code is required')
  } else if (!/^\d{5}(-\d{4})?$/.test(address.zip.trim())) {
    errors.push('Invalid ZIP code format')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}