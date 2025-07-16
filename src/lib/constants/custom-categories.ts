// Custom category structure for Four Speed Motorcycle Shop
// Following WPS API recommendations to create our own differentiated categorization
// instead of using their "Catalog Classification" taxonomy

export interface CustomCategory {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  image?: string
  gradient: string
  productTypeFilters: string[]
  brandFilters?: number[]
  namePatterns?: string[]
  priceRange?: { min?: number; max?: number }
  featured?: boolean
  subcategories?: CustomCategory[]
}

// Product types available in WPS API (from CLAUDE.md)
export const WPS_PRODUCT_TYPES = [
  'Suspension', 'Hardware/Fasteners/Fittings', 'Promotional', 'Tire/Wheel Accessories', 
  'Drive', 'Intake/Carb/Fuel System', 'Graphics/Decals', 'Exhaust', 'Stands/Lifts', 
  'Mats/Rugs', 'Straps/Tie-Downs', 'Accessories', 'Grips', 'Gloves', 'Tools', 
  'Chemicals', 'Utility Containers', 'Fuel Containers', 'Eyewear', 'Sprockets', 
  'Winch', 'Mounts/Brackets', 'Trailer/Towing', 'Body', 'Windshield/Windscreen', 
  'Electrical', 'Engine', 'Protective/Safety', 'Wheels', 'Skis/Carbides/Runners', 
  'Plow', 'Plow Mount', 'Piston kits & Components', 'Track Kit', 'Footwear', 
  'Hyfax', 'Illumination', 'Clutch', 'Air Filters', 'Jets', 'Gaskets/Seals', 
  'Clamps', 'Mirrors', 'Oil Filters', 'Gas Caps', 'Foot Controls', 'Levers', 
  'Cable/Hydraulic Control Lines', 'Starters', 'Throttle', 'Audio/Visual/Communication', 
  'Switches', 'Onesies', 'Guards/Braces', 'Handguards', 'Engine Management', 
  'Spark Plugs', 'Brakes', 'Risers', 'Ice Scratchers', 'Headgear', 'Shirts', 
  'Steering', 'Tracks', 'Handlebars', 'Seat', 'Luggage', 'Watercraft Towables', 
  'Hand Controls', 'Belts', 'Fuel Tank', 'Flotation Vests', 'Racks', 
  'Helmet Accessories', 'Layers', 'Vests', 'Storage Covers', 'Socks', 
  'Gauges/Meters', 'Security', 'Suits', 'Wheel Components', 'Replacement Parts', 
  'Shorts', 'Hoodies', 'Jackets', 'Jerseys', 'Pants', 'Chains', 'UTV Cab/Roof/Door', 
  'Helmets', 'Batteries', 'Tires', 'Tubes', 'Farm/Agriculture', 'Rims', 
  'Bicycle Frames', 'Cranks', 'Tank Tops', 'Bike', 'Sweaters', 'GPS', 'Videos', 
  'Shoes', 'Tire And Wheel Kit', 'Undergarments', 'Forks', 'Food & Beverage', 
  'Winch Mount'
]

// Our custom categorization - motorcycle-focused and user-centric
export const CUSTOM_CATEGORIES: CustomCategory[] = [
  {
    id: 'engine-performance',
    name: 'Engine & Performance',
    slug: 'engine-performance',
    description: 'Engine parts, performance upgrades, and power-enhancing modifications',
    icon: '⚙️',
    image: '/images/categories/engine.JPG',
    gradient: 'from-red-500 to-orange-600',
    productTypeFilters: [
      'Engine', 'Intake/Carb/Fuel System', 'Exhaust', 'Air Filters', 
      'Oil Filters', 'Spark Plugs', 'Engine Management', 'Clutch', 
      'Piston kits & Components', 'Jets', 'Gaskets/Seals', 'Fuel Tank',
      'Gas Caps', 'Starters', 'Throttle'
    ],
    featured: true
  },
  {
    id: 'suspension-handling',
    name: 'Suspension & Handling',
    slug: 'suspension-handling',
    description: 'Suspension components, forks, shocks, and handling upgrades',
    icon: '🔧',
    image: '/images/categories/suspension.JPG',
    gradient: 'from-blue-500 to-indigo-600',
    productTypeFilters: [
      'Suspension', 'Forks', 'Steering', 'Handlebars', 'Risers'
    ],
    featured: true
  },
  {
    id: 'wheels-tires',
    name: 'Wheels & Tires',
    slug: 'wheels-tires',
    description: 'Wheels, tires, tubes, and tire accessories for all riding conditions',
    icon: '🛞',
    image: '/images/categories/wheelsTires.JPG',
    gradient: 'from-gray-500 to-slate-700',
    productTypeFilters: [
      'Wheels', 'Tires', 'Tubes', 'Rims', 'Tire/Wheel Accessories', 
      'Wheel Components', 'Tire And Wheel Kit'
    ],
    featured: true
  },
  {
    id: 'protective-gear',
    name: 'Protective Gear',
    slug: 'protective-gear',
    description: 'Helmets, body armor, protective clothing, and safety equipment',
    icon: '🛡️',
    image: '/images/categories/protectiveGear.JPG',
    gradient: 'from-green-500 to-emerald-600',
    productTypeFilters: [
      'Helmets', 'Protective/Safety', 'Guards/Braces', 'Handguards',
      'Helmet Accessories', 'Flotation Vests', 'Eyewear'
    ],
    featured: true
  },
  {
    id: 'riding-apparel',
    name: 'Riding Apparel',
    slug: 'riding-apparel',
    description: 'Jackets, pants, gloves, boots, and all riding clothing',
    icon: '👕',
    image: '/images/categories/ridingApparel.JPG',
    gradient: 'from-purple-500 to-pink-600',
    productTypeFilters: [
      'Jackets', 'Pants', 'Gloves', 'Footwear', 'Shirts', 'Shorts',
      'Hoodies', 'Jerseys', 'Vests', 'Layers', 'Suits', 'Onesies',
      'Tank Tops', 'Sweaters', 'Socks', 'Undergarments', 'Shoes',
      'Headgear'
    ],
    featured: true
  },
  {
    id: 'brakes-drivetrain',
    name: 'Brakes & Drivetrain',
    slug: 'brakes-drivetrain',
    description: 'Brake components, chains, sprockets, and drivetrain parts',
    icon: '⚡',
    image: '/images/categories/drivetrain.JPG',
    gradient: 'from-yellow-500 to-amber-600',
    productTypeFilters: [
      'Brakes', 'Chains', 'Sprockets', 'Drive', 'Belts'
    ],
    featured: true
  },
  {
    id: 'electrical-lighting',
    name: 'Electrical & Lighting',
    slug: 'electrical-lighting',
    description: 'Electrical systems, lighting, batteries, and electronic accessories',
    icon: '💡',
    gradient: 'from-cyan-500 to-blue-600',
    productTypeFilters: [
      'Electrical', 'Illumination', 'Batteries', 'Switches', 
      'Audio/Visual/Communication', 'GPS', 'Gauges/Meters'
    ]
  },
  {
    id: 'controls-accessories',
    name: 'Controls & Accessories',
    slug: 'controls-accessories',
    description: 'Hand controls, foot controls, levers, grips, and riding accessories',
    icon: '🎛️',
    gradient: 'from-indigo-500 to-purple-600',
    productTypeFilters: [
      'Hand Controls', 'Foot Controls', 'Levers', 'Grips', 'Mirrors',
      'Cable/Hydraulic Control Lines', 'Accessories', 'Clamps'
    ]
  },
  {
    id: 'body-styling',
    name: 'Body & Styling',
    slug: 'body-styling',
    description: 'Body panels, windshields, graphics, and styling accessories',
    icon: '🎨',
    gradient: 'from-rose-500 to-pink-600',
    productTypeFilters: [
      'Body', 'Windshield/Windscreen', 'Graphics/Decals', 'Seat',
      'Storage Covers'
    ]
  },
  {
    id: 'maintenance-tools',
    name: 'Maintenance & Tools',
    slug: 'maintenance-tools',
    description: 'Tools, chemicals, maintenance supplies, and workshop equipment',
    icon: '🔨',
    gradient: 'from-orange-500 to-red-600',
    productTypeFilters: [
      'Tools', 'Chemicals', 'Stands/Lifts', 'Utility Containers', 
      'Fuel Containers', 'Replacement Parts'
    ]
  },
  {
    id: 'storage-transport',
    name: 'Storage & Transport',
    slug: 'storage-transport',
    description: 'Luggage, racks, tie-downs, and transportation accessories',
    icon: '🎒',
    gradient: 'from-teal-500 to-green-600',
    productTypeFilters: [
      'Luggage', 'Racks', 'Straps/Tie-Downs', 'Trailer/Towing',
      'Mounts/Brackets'
    ]
  },
  {
    id: 'specialty-vehicles',
    name: 'Specialty Vehicles',
    slug: 'specialty-vehicles',
    description: 'ATV, UTV, snowmobile, and watercraft specific parts',
    icon: '🏔️',
    gradient: 'from-slate-500 to-gray-600',
    productTypeFilters: [
      'UTV Cab/Roof/Door', 'Skis/Carbides/Runners', 'Ice Scratchers',
      'Tracks', 'Track Kit', 'Hyfax', 'Plow', 'Plow Mount',
      'Watercraft Towables', 'Winch', 'Winch Mount'
    ]
  }
]

// Helper function to get category by slug
export const getCategoryBySlug = (slug: string): CustomCategory | undefined => {
  return CUSTOM_CATEGORIES.find(cat => cat.slug === slug)
}

// Helper function to get all product types for a category
export const getProductTypesForCategory = (slug: string): string[] => {
  const category = getCategoryBySlug(slug)
  return category?.productTypeFilters || []
}

// Helper function to check if a product belongs to a category
export const doesProductBelongToCategory = (
  productType: string, 
  productName: string, 
  categorySlug: string
): boolean => {
  const category = getCategoryBySlug(categorySlug)
  if (!category) return false

  // Check product type match
  if (category.productTypeFilters.includes(productType)) {
    return true
  }

  // Check name patterns if defined
  if (category.namePatterns) {
    const searchText = productName.toLowerCase()
    return category.namePatterns.some(pattern => 
      searchText.includes(pattern.toLowerCase())
    )
  }

  return false
}

// Get featured categories for homepage
export const getFeaturedCategories = (): CustomCategory[] => {
  return CUSTOM_CATEGORIES.filter(cat => cat.featured)
}

// Category mapping for old taxonomy IDs (for backward compatibility)
export const LEGACY_CATEGORY_MAPPING: Record<number, string> = {
  192: 'riding-apparel',  // Old Apparel -> Riding Apparel
  193: 'specialty-vehicles',  // Old ATV -> Specialty Vehicles  
  194: 'maintenance-tools',  // Old Bicycle -> Maintenance & Tools
  197: 'engine-performance',  // Old Offroad -> Engine & Performance
  198: 'specialty-vehicles',  // Old Snow -> Specialty Vehicles
  199: 'suspension-handling',  // Old Street -> Suspension & Handling
  200: 'specialty-vehicles'   // Old Watercraft -> Specialty Vehicles
}