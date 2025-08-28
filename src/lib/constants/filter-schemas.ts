// Category-specific filter schemas for enhanced filtering
export interface FilterOption {
  value: string
  label: string
  count?: number
}

export interface FilterSchema {
  key: string
  label: string
  type: 'select' | 'checkbox' | 'price-range' | 'multi-select' | 'size-range' | 'weight-range'
  options?: FilterOption[]
  required?: boolean
  defaultExpanded?: boolean
  apiField?: string
  categorySpecific?: boolean
}

export interface CategoryFilterConfig {
  categoryId: number
  categorySlug: string
  filters: FilterSchema[]
}

// Common filters available across all categories
export const COMMON_FILTERS: FilterSchema[] = [
  {
    key: 'product_type',
    label: 'Product Type',
    type: 'select',
    apiField: 'product_type',
    defaultExpanded: true,
    options: [], // Will be populated dynamically
  },
  {
    key: 'brand_id',
    label: 'Brand',
    type: 'select',
    apiField: 'brand_id',
    defaultExpanded: true,
    options: [], // Will be populated dynamically
  },
  {
    key: 'price_range',
    label: 'Price Range',
    type: 'price-range',
    apiField: 'list_price',
    defaultExpanded: true,
  },
  {
    key: 'availability',
    label: 'Availability',
    type: 'checkbox',
    defaultExpanded: false,
    options: [{ value: 'in_stock', label: 'In Stock Only' }],
  },
]

// Smart product type mapping based on WPS API data and category context
export const CATEGORY_PRODUCT_TYPE_MAPPING: Record<string, string[]> = {
  // ATV category - common ATV parts and accessories
  atv: [
    'Suspension',
    'Wheels',
    'Tires',
    'Brakes',
    'Engine',
    'Exhaust',
    'Air Filters',
    'Drive',
    'Electrical',
    'Body',
    'Protective/Safety',
    'Winch',
    'Plow',
    'Accessories',
    'Stands/Lifts',
    'Tools',
    'Chemicals',
    'Batteries',
    'Lighting',
    'Storage Covers',
  ],
  // Bicycle category - bike-specific components
  bicycle: [
    'Bicycle Frames',
    'Wheels',
    'Tires',
    'Tubes',
    'Brakes',
    'Cranks',
    'Chains',
    'Tools',
    'Accessories',
    'Protective/Safety',
    'Helmets',
    'Apparel',
  ],
  // Apparel category - clothing and protective gear
  apparel: [
    'Helmets',
    'Jackets',
    'Pants',
    'Gloves',
    'Boots',
    'Suits',
    'Shirts',
    'Shorts',
    'Hoodies',
    'Vests',
    'Layers',
    'Undergarments',
    'Socks',
    'Tank Tops',
    'Sweaters',
    'Protective/Safety',
    'Eyewear',
    'Headgear',
  ],
  // Off-road category - dirt bike and motocross parts
  offroad: [
    'Suspension',
    'Exhaust',
    'Air Filters',
    'Brakes',
    'Engine',
    'Drive',
    'Wheels',
    'Tires',
    'Handlebars',
    'Grips',
    'Foot Controls',
    'Levers',
    'Guards/Braces',
    'Protective/Safety',
    'Tools',
    'Chemicals',
    'Accessories',
  ],
  // Street category - street bike parts
  street: [
    'Suspension',
    'Exhaust',
    'Brakes',
    'Engine',
    'Electrical',
    'Wheels',
    'Tires',
    'Handlebars',
    'Mirrors',
    'Windshield/Windscreen',
    'Accessories',
    'Tools',
    'Chemicals',
    'Protective/Safety',
  ],
  // Snow category - snowmobile parts
  snow: [
    'Suspension',
    'Engine',
    'Drive',
    'Electrical',
    'Tracks',
    'Skis/Carbides/Runners',
    'Hyfax',
    'Ice Scratchers',
    'Windshield/Windscreen',
    'Accessories',
    'Tools',
    'Chemicals',
    'Storage Covers',
    'Protective/Safety',
  ],
  // Watercraft category - jet ski and PWC parts
  watercraft: [
    'Engine',
    'Drive',
    'Electrical',
    'Batteries',
    'Fuel Tank',
    'Accessories',
    'Tools',
    'Chemicals',
    'Protective/Safety',
    'Flotation Vests',
    'Storage Covers',
    'Watercraft Towables',
  ],
  // Suspension category
  suspension: ['Suspension'],
  // Exhaust category
  exhaust: ['Exhaust'],
  // Brakes category
  brakes: ['Brakes'],
  // Tires category
  tires: ['Tires', 'Tubes', 'Tire/Wheel Accessories', 'Wheels'],
  // Tools category
  tools: ['Tools'],
  // Chemicals category
  chemicals: ['Chemicals'],
  // Electronics category
  electronics: [
    'Electrical',
    'Batteries',
    'Lighting',
    'Gauges/Meters',
    'Audio/Visual/Communication',
    'GPS',
    'Switches',
  ],
  // Engine category
  engine: [
    'Engine',
    'Piston kits & Components',
    'Gaskets/Seals',
    'Oil Filters',
    'Air Filters',
    'Spark Plugs',
    'Starters',
    'Engine Management',
  ],
  // Hardware category
  hardware: ['Hardware/Fasteners/Fittings', 'Clamps', 'Mounts/Brackets'],
}

// Category-specific filter configurations
export const CATEGORY_FILTER_CONFIGS: CategoryFilterConfig[] = [
  // Suspension category
  {
    categoryId: 1,
    categorySlug: 'suspension',
    filters: [
      ...COMMON_FILTERS,
      {
        key: 'suspension_type',
        label: 'Suspension Type',
        type: 'multi-select',
        categorySpecific: true,
        defaultExpanded: true,
        options: [
          { value: 'fork_springs', label: 'Fork Springs' },
          { value: 'shock_absorbers', label: 'Shock Absorbers' },
          { value: 'suspension_kits', label: 'Suspension Kits' },
          { value: 'lowering_kits', label: 'Lowering Kits' },
          { value: 'raising_kits', label: 'Raising Kits' },
        ],
      },
      {
        key: 'diameter',
        label: 'Diameter (mm)',
        type: 'multi-select',
        categorySpecific: true,
        defaultExpanded: false,
        options: [
          { value: '35', label: '35mm' },
          { value: '39', label: '39mm' },
          { value: '41', label: '41mm' },
          { value: '43', label: '43mm' },
          { value: '45', label: '45mm' },
          { value: '49', label: '49mm' },
        ],
      },
    ],
  },
  // Exhaust category
  {
    categoryId: 2,
    categorySlug: 'exhaust',
    filters: [
      ...COMMON_FILTERS,
      {
        key: 'exhaust_type',
        label: 'Exhaust Type',
        type: 'multi-select',
        categorySpecific: true,
        defaultExpanded: true,
        options: [
          { value: 'full_system', label: 'Full System' },
          { value: 'slip_on', label: 'Slip-On' },
          { value: 'mufflers', label: 'Mufflers' },
          { value: 'headers', label: 'Headers' },
          { value: 'repack_kits', label: 'Repack Kits' },
        ],
      },
      {
        key: 'material',
        label: 'Material',
        type: 'multi-select',
        categorySpecific: true,
        defaultExpanded: false,
        options: [
          { value: 'stainless_steel', label: 'Stainless Steel' },
          { value: 'titanium', label: 'Titanium' },
          { value: 'carbon_fiber', label: 'Carbon Fiber' },
          { value: 'aluminum', label: 'Aluminum' },
        ],
      },
    ],
  },
  // Brakes category
  {
    categoryId: 3,
    categorySlug: 'brakes',
    filters: [
      ...COMMON_FILTERS,
      {
        key: 'brake_type',
        label: 'Brake Type',
        type: 'multi-select',
        categorySpecific: true,
        defaultExpanded: true,
        options: [
          { value: 'brake_pads', label: 'Brake Pads' },
          { value: 'brake_discs', label: 'Brake Discs' },
          { value: 'brake_lines', label: 'Brake Lines' },
          { value: 'brake_fluid', label: 'Brake Fluid' },
          { value: 'calipers', label: 'Calipers' },
        ],
      },
      {
        key: 'rotor_size',
        label: 'Rotor Size (mm)',
        type: 'multi-select',
        categorySpecific: true,
        defaultExpanded: false,
        options: [
          { value: '240', label: '240mm' },
          { value: '270', label: '270mm' },
          { value: '280', label: '280mm' },
          { value: '300', label: '300mm' },
          { value: '320', label: '320mm' },
        ],
      },
    ],
  },
  // Tires category
  {
    categoryId: 4,
    categorySlug: 'tires',
    filters: [
      ...COMMON_FILTERS,
      {
        key: 'tire_type',
        label: 'Tire Type',
        type: 'multi-select',
        categorySpecific: true,
        defaultExpanded: true,
        options: [
          { value: 'street', label: 'Street' },
          { value: 'dirt', label: 'Dirt/Off-Road' },
          { value: 'dual_sport', label: 'Dual Sport' },
          { value: 'track', label: 'Track/Racing' },
          { value: 'touring', label: 'Touring' },
        ],
      },
      {
        key: 'tire_size',
        label: 'Tire Size',
        type: 'multi-select',
        categorySpecific: true,
        defaultExpanded: true,
        options: [
          { value: '120_70_17', label: '120/70-17' },
          { value: '180_55_17', label: '180/55-17' },
          { value: '190_50_17', label: '190/50-17' },
          { value: '200_55_17', label: '200/55-17' },
          { value: '110_80_19', label: '110/80-19' },
          { value: '140_80_18', label: '140/80-18' },
        ],
      },
    ],
  },
  // Apparel category
  {
    categoryId: 5,
    categorySlug: 'apparel',
    filters: [
      ...COMMON_FILTERS,
      {
        key: 'apparel_type',
        label: 'Apparel Type',
        type: 'multi-select',
        categorySpecific: true,
        defaultExpanded: true,
        options: [
          { value: 'helmets', label: 'Helmets' },
          { value: 'jackets', label: 'Jackets' },
          { value: 'pants', label: 'Pants' },
          { value: 'gloves', label: 'Gloves' },
          { value: 'boots', label: 'Boots' },
          { value: 'suits', label: 'Suits' },
        ],
      },
      {
        key: 'size',
        label: 'Size',
        type: 'multi-select',
        categorySpecific: true,
        defaultExpanded: true,
        options: [
          { value: 'xs', label: 'XS' },
          { value: 's', label: 'S' },
          { value: 'm', label: 'M' },
          { value: 'l', label: 'L' },
          { value: 'xl', label: 'XL' },
          { value: 'xxl', label: '2XL' },
          { value: 'xxxl', label: '3XL' },
        ],
      },
      {
        key: 'color',
        label: 'Color',
        type: 'multi-select',
        categorySpecific: true,
        defaultExpanded: false,
        options: [
          { value: 'black', label: 'Black' },
          { value: 'white', label: 'White' },
          { value: 'red', label: 'Red' },
          { value: 'blue', label: 'Blue' },
          { value: 'yellow', label: 'Yellow' },
          { value: 'green', label: 'Green' },
        ],
      },
    ],
  },
  // Tools category
  {
    categoryId: 6,
    categorySlug: 'tools',
    filters: [
      ...COMMON_FILTERS,
      {
        key: 'tool_type',
        label: 'Tool Type',
        type: 'multi-select',
        categorySpecific: true,
        defaultExpanded: true,
        options: [
          { value: 'hand_tools', label: 'Hand Tools' },
          { value: 'power_tools', label: 'Power Tools' },
          { value: 'specialty_tools', label: 'Specialty Tools' },
          { value: 'measuring_tools', label: 'Measuring Tools' },
          { value: 'tool_kits', label: 'Tool Kits' },
        ],
      },
      {
        key: 'tool_brand',
        label: 'Tool Brand',
        type: 'multi-select',
        categorySpecific: true,
        defaultExpanded: false,
        options: [
          { value: 'motion_pro', label: 'Motion Pro' },
          { value: 'cruz_tools', label: 'Cruz Tools' },
          { value: 'park_tool', label: 'Park Tool' },
          { value: 'craftsman', label: 'Craftsman' },
        ],
      },
    ],
  },
  // Chemicals category
  {
    categoryId: 7,
    categorySlug: 'chemicals',
    filters: [
      ...COMMON_FILTERS,
      {
        key: 'chemical_type',
        label: 'Chemical Type',
        type: 'multi-select',
        categorySpecific: true,
        defaultExpanded: true,
        options: [
          { value: 'engine_oil', label: 'Engine Oil' },
          { value: 'brake_fluid', label: 'Brake Fluid' },
          { value: 'coolant', label: 'Coolant' },
          { value: 'cleaners', label: 'Cleaners' },
          { value: 'lubricants', label: 'Lubricants' },
          { value: 'fuel_additives', label: 'Fuel Additives' },
        ],
      },
      {
        key: 'viscosity',
        label: 'Viscosity',
        type: 'multi-select',
        categorySpecific: true,
        defaultExpanded: false,
        options: [
          { value: '5w_30', label: '5W-30' },
          { value: '10w_40', label: '10W-40' },
          { value: '15w_50', label: '15W-50' },
          { value: '20w_50', label: '20W-50' },
        ],
      },
    ],
  },
  // Electronics category
  {
    categoryId: 8,
    categorySlug: 'electronics',
    filters: [
      ...COMMON_FILTERS,
      {
        key: 'electronic_type',
        label: 'Electronic Type',
        type: 'multi-select',
        categorySpecific: true,
        defaultExpanded: true,
        options: [
          { value: 'batteries', label: 'Batteries' },
          { value: 'lighting', label: 'Lighting' },
          { value: 'ignition', label: 'Ignition' },
          { value: 'charging', label: 'Charging' },
          { value: 'gauges', label: 'Gauges' },
          { value: 'communication', label: 'Communication' },
        ],
      },
      {
        key: 'voltage',
        label: 'Voltage',
        type: 'multi-select',
        categorySpecific: true,
        defaultExpanded: false,
        options: [
          { value: '12v', label: '12V' },
          { value: '24v', label: '24V' },
          { value: '6v', label: '6V' },
        ],
      },
    ],
  },
]

// Helper function to get filters for a specific category
export function getFiltersForCategory(categoryId: number, categorySlug: string): FilterSchema[] {
  const categoryConfig = CATEGORY_FILTER_CONFIGS.find(
    (config) => config.categoryId === categoryId || config.categorySlug === categorySlug
  )

  if (categoryConfig) {
    return categoryConfig.filters
  }

  // Return common filters if no specific config found
  return COMMON_FILTERS
}

// Helper function to get smart product types for a category
export function getSmartProductTypesForCategory(categorySlug: string): string[] {
  // First try exact match
  if (CATEGORY_PRODUCT_TYPE_MAPPING[categorySlug]) {
    return CATEGORY_PRODUCT_TYPE_MAPPING[categorySlug]
  }

  // Try partial matches for related categories
  const lowerSlug = categorySlug.toLowerCase()

  // Check for common patterns
  if (lowerSlug.includes('atv') || lowerSlug.includes('quad')) {
    return CATEGORY_PRODUCT_TYPE_MAPPING['atv']
  }
  if (lowerSlug.includes('bike') || lowerSlug.includes('bicycle')) {
    return CATEGORY_PRODUCT_TYPE_MAPPING['bicycle']
  }
  if (
    lowerSlug.includes('apparel') ||
    lowerSlug.includes('clothing') ||
    lowerSlug.includes('gear')
  ) {
    return CATEGORY_PRODUCT_TYPE_MAPPING['apparel']
  }
  if (lowerSlug.includes('dirt') || lowerSlug.includes('motocross') || lowerSlug.includes('mx')) {
    return CATEGORY_PRODUCT_TYPE_MAPPING['offroad']
  }
  if (
    lowerSlug.includes('street') ||
    lowerSlug.includes('sport') ||
    lowerSlug.includes('touring')
  ) {
    return CATEGORY_PRODUCT_TYPE_MAPPING['street']
  }
  if (lowerSlug.includes('snow') || lowerSlug.includes('sled')) {
    return CATEGORY_PRODUCT_TYPE_MAPPING['snow']
  }
  if (lowerSlug.includes('water') || lowerSlug.includes('jet') || lowerSlug.includes('pwc')) {
    return CATEGORY_PRODUCT_TYPE_MAPPING['watercraft']
  }
  if (lowerSlug.includes('engine') || lowerSlug.includes('motor')) {
    return CATEGORY_PRODUCT_TYPE_MAPPING['engine']
  }
  if (lowerSlug.includes('hardware') || lowerSlug.includes('fastener')) {
    return CATEGORY_PRODUCT_TYPE_MAPPING['hardware']
  }

  // Return all common types if no specific mapping found
  return [
    'Suspension',
    'Hardware/Fasteners/Fittings',
    'Tire/Wheel Accessories',
    'Drive',
    'Intake/Carb/Fuel System',
    'Exhaust',
    'Stands/Lifts',
    'Accessories',
    'Grips',
    'Gloves',
    'Tools',
    'Chemicals',
    'Protective/Safety',
    'Wheels',
    'Electrical',
    'Engine',
    'Brakes',
    'Handlebars',
    'Helmets',
    'Apparel',
    'Tires',
    'Chains',
  ]
}

// Helper function to get filter options by product type
export function getFilterOptionsByProductType(productType: string): FilterOption[] {
  const typeFilters: Record<string, FilterOption[]> = {
    Suspension: [
      { value: 'fork_springs', label: 'Fork Springs' },
      { value: 'shock_absorbers', label: 'Shock Absorbers' },
      { value: 'suspension_kits', label: 'Suspension Kits' },
    ],
    Exhaust: [
      { value: 'full_system', label: 'Full System' },
      { value: 'slip_on', label: 'Slip-On' },
      { value: 'mufflers', label: 'Mufflers' },
    ],
    Brakes: [
      { value: 'brake_pads', label: 'Brake Pads' },
      { value: 'brake_discs', label: 'Brake Discs' },
      { value: 'brake_lines', label: 'Brake Lines' },
    ],
    Tires: [
      { value: 'street', label: 'Street' },
      { value: 'dirt', label: 'Dirt/Off-Road' },
      { value: 'dual_sport', label: 'Dual Sport' },
    ],
    Helmets: [
      { value: 'full_face', label: 'Full Face' },
      { value: 'modular', label: 'Modular' },
      { value: 'half_helmet', label: 'Half Helmet' },
    ],
    Tools: [
      { value: 'hand_tools', label: 'Hand Tools' },
      { value: 'power_tools', label: 'Power Tools' },
      { value: 'specialty_tools', label: 'Specialty Tools' },
    ],
  }

  return typeFilters[productType] || []
}

// Price range presets
export const PRICE_RANGE_PRESETS = [
  { min: 0, max: 25, label: 'Under $25' },
  { min: 25, max: 50, label: '$25 - $50' },
  { min: 50, max: 100, label: '$50 - $100' },
  { min: 100, max: 250, label: '$100 - $250' },
  { min: 250, max: 500, label: '$250 - $500' },
  { min: 500, max: 1000, label: '$500 - $1000' },
  { min: 1000, max: null, label: 'Over $1000' },
]

// Weight range presets (in pounds)
export const WEIGHT_RANGE_PRESETS = [
  { min: 0, max: 1, label: 'Under 1 lb' },
  { min: 1, max: 5, label: '1 - 5 lbs' },
  { min: 5, max: 10, label: '5 - 10 lbs' },
  { min: 10, max: 25, label: '10 - 25 lbs' },
  { min: 25, max: null, label: 'Over 25 lbs' },
]
