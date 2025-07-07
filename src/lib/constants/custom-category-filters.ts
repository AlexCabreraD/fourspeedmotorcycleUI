// Custom category-specific filters for our new category system
// Following WPS recommendations for smart filtering by product attributes

import { CustomCategory } from './custom-categories'

export interface FilterOption {
  value: string
  label: string
  count?: number
}

export interface FilterSchema {
  key: string
  label: string
  type: 'select' | 'checkbox' | 'price-range' | 'multi-select' | 'size-range' | 'weight-range' | 'search'
  options?: FilterOption[]
  required?: boolean
  defaultExpanded?: boolean
  apiField?: string
  placeholder?: string
  description?: string
}

export interface CategoryFilterConfig {
  categorySlug: string
  filters: FilterSchema[]
}

// Base filters that work for most categories
export const BASE_FILTERS: FilterSchema[] = [
  {
    key: 'search',
    label: 'Search Products',
    type: 'search',
    apiField: 'search',
    placeholder: 'Search by name, brand, or model...',
    defaultExpanded: true
  },
  {
    key: 'price_range',
    label: 'Price Range',
    type: 'price-range',
    apiField: 'price_range',
    defaultExpanded: true
  },
  {
    key: 'in_stock',
    label: 'Availability',
    type: 'checkbox',
    apiField: 'in_stock',
    defaultExpanded: true,
    options: [
      { value: 'true', label: 'In Stock Only' }
    ]
  }
]

// Category-specific filter configurations
export const CUSTOM_CATEGORY_FILTERS: CategoryFilterConfig[] = [
  {
    categorySlug: 'engine-performance',
    filters: [
      ...BASE_FILTERS,
      {
        key: 'product_type',
        label: 'Engine Component',
        type: 'multi-select',
        apiField: 'product_type',
        defaultExpanded: true,
        options: [
          { value: 'Engine', label: 'Engine Parts' },
          { value: 'Intake/Carb/Fuel System', label: 'Intake & Fuel' },
          { value: 'Exhaust', label: 'Exhaust Systems' },
          { value: 'Air Filters', label: 'Air Filters' },
          { value: 'Oil Filters', label: 'Oil Filters' },
          { value: 'Spark Plugs', label: 'Spark Plugs' },
          { value: 'Engine Management', label: 'Engine Management' },
          { value: 'Clutch', label: 'Clutch Components' }
        ]
      },
    ]
  },
  {
    categorySlug: 'suspension-handling',
    filters: [
      ...BASE_FILTERS,
      {
        key: 'product_type',
        label: 'Suspension Type',
        type: 'multi-select',
        apiField: 'product_type',
        defaultExpanded: true,
        options: [
          { value: 'Suspension', label: 'Suspension Systems' },
          { value: 'Forks', label: 'Forks' },
          { value: 'Steering', label: 'Steering Components' },
          { value: 'Handlebars', label: 'Handlebars' },
          { value: 'Risers', label: 'Risers' }
        ]
      },
      {
        key: 'suspension_type',
        label: 'Component Type',
        type: 'multi-select',
        apiField: 'suspension_type',
        options: [
          { value: 'fork_springs', label: 'Fork Springs' },
          { value: 'shock_absorbers', label: 'Shock Absorbers' },
          { value: 'lowering_kits', label: 'Lowering Kits' },
          { value: 'raising_kits', label: 'Raising Kits' }
        ]
      }
    ]
  },
  {
    categorySlug: 'wheels-tires',
    filters: [
      ...BASE_FILTERS,
      {
        key: 'product_type',
        label: 'Product Type',
        type: 'multi-select',
        apiField: 'product_type',
        defaultExpanded: true,
        options: [
          { value: 'Wheels', label: 'Wheels' },
          { value: 'Tires', label: 'Tires' },
          { value: 'Tubes', label: 'Tubes' },
          { value: 'Rims', label: 'Rims' },
          { value: 'Tire/Wheel Accessories', label: 'Accessories' }
        ]
      },
      {
        key: 'tire_size',
        label: 'Tire Size',
        type: 'multi-select',
        apiField: 'tire_size',
        options: [
          { value: '120_70_17', label: '120/70-17' },
          { value: '190_50_17', label: '190/50-17' },
          { value: '180_55_17', label: '180/55-17' },
          { value: '110_70_17', label: '110/70-17' },
          { value: '21_7_10', label: '21x7-10' },
          { value: '20_10_9', label: '20x10-9' }
        ]
      },
      {
        key: 'wheel_size',
        label: 'Wheel Size',
        type: 'multi-select',
        apiField: 'wheel_size',
        options: [
          { value: '17', label: '17"' },
          { value: '18', label: '18"' },
          { value: '19', label: '19"' },
          { value: '21', label: '21"' },
          { value: '16', label: '16"' },
          { value: '15', label: '15"' }
        ]
      }
    ]
  },
  {
    categorySlug: 'protective-gear',
    filters: [
      ...BASE_FILTERS,
      {
        key: 'product_type',
        label: 'Protection Type',
        type: 'multi-select',
        apiField: 'product_type',
        defaultExpanded: true,
        options: [
          { value: 'Helmets', label: 'Helmets' },
          { value: 'Protective/Safety', label: 'Body Armor' },
          { value: 'Guards/Braces', label: 'Guards & Braces' },
          { value: 'Handguards', label: 'Hand Guards' },
          { value: 'Eyewear', label: 'Eye Protection' }
        ]
      },
      {
        key: 'size',
        label: 'Size',
        type: 'multi-select',
        apiField: 'size',
        options: [
          { value: 'XS', label: 'Extra Small' },
          { value: 'S', label: 'Small' },
          { value: 'M', label: 'Medium' },
          { value: 'L', label: 'Large' },
          { value: 'XL', label: 'Extra Large' },
          { value: 'XXL', label: '2X Large' }
        ]
      },
      {
        key: 'protection_type',
        label: 'Protection Level',
        type: 'multi-select',
        apiField: 'protection_type',
        options: [
          { value: 'full face', label: 'Full Face' },
          { value: 'half helmet', label: 'Half Helmet' },
          { value: 'chest', label: 'Chest Protection' },
          { value: 'back', label: 'Back Protection' },
          { value: 'knee', label: 'Knee Protection' }
        ]
      }
    ]
  },
  {
    categorySlug: 'riding-apparel',
    filters: [
      ...BASE_FILTERS,
      {
        key: 'product_type',
        label: 'Apparel Type',
        type: 'multi-select',
        apiField: 'product_type',
        defaultExpanded: true,
        options: [
          { value: 'Jackets', label: 'Jackets' },
          { value: 'Pants', label: 'Pants' },
          { value: 'Gloves', label: 'Gloves' },
          { value: 'Footwear', label: 'Boots & Shoes' },
          { value: 'Shirts', label: 'Shirts' },
          { value: 'Hoodies', label: 'Hoodies' },
          { value: 'Jerseys', label: 'Jerseys' }
        ]
      },
      {
        key: 'size',
        label: 'Size',
        type: 'multi-select',
        apiField: 'size',
        options: [
          { value: 'XS', label: 'Extra Small' },
          { value: 'S', label: 'Small' },
          { value: 'M', label: 'Medium' },
          { value: 'L', label: 'Large' },
          { value: 'XL', label: 'Extra Large' },
          { value: 'XXL', label: '2X Large' },
          { value: '3XL', label: '3X Large' }
        ]
      },
      {
        key: 'color',
        label: 'Color',
        type: 'multi-select',
        apiField: 'color',
        options: [
          { value: 'black', label: 'Black' },
          { value: 'white', label: 'White' },
          { value: 'red', label: 'Red' },
          { value: 'blue', label: 'Blue' },
          { value: 'orange', label: 'Orange' },
          { value: 'yellow', label: 'Yellow' },
          { value: 'green', label: 'Green' }
        ]
      },
      {
        key: 'gender',
        label: 'Gender',
        type: 'select',
        apiField: 'gender',
        options: [
          { value: 'mens', label: "Men's" },
          { value: 'womens', label: "Women's" },
          { value: 'unisex', label: 'Unisex' },
          { value: 'youth', label: 'Youth' }
        ]
      }
    ]
  },
  {
    categorySlug: 'brakes-drivetrain',
    filters: [
      ...BASE_FILTERS,
      {
        key: 'product_type',
        label: 'Component Type',
        type: 'multi-select',
        apiField: 'product_type',
        defaultExpanded: true,
        options: [
          { value: 'Brakes', label: 'Brake Components' },
          { value: 'Chains', label: 'Chains' },
          { value: 'Sprockets', label: 'Sprockets' },
          { value: 'Drive', label: 'Drive Components' },
          { value: 'Belts', label: 'Belts' }
        ]
      }
    ]
  },
  {
    categorySlug: 'electrical-lighting',
    filters: [
      ...BASE_FILTERS,
      {
        key: 'product_type',
        label: 'Electrical Type',
        type: 'multi-select',
        apiField: 'product_type',
        defaultExpanded: true,
        options: [
          { value: 'Electrical', label: 'Electrical Components' },
          { value: 'Illumination', label: 'Lighting' },
          { value: 'Batteries', label: 'Batteries' },
          { value: 'Switches', label: 'Switches' },
          { value: 'Audio/Visual/Communication', label: 'Audio/Video/Comm' },
          { value: 'GPS', label: 'GPS & Navigation' }
        ]
      }
    ]
  },
  {
    categorySlug: 'controls-accessories',
    filters: [
      ...BASE_FILTERS,
      {
        key: 'product_type',
        label: 'Control Type',
        type: 'multi-select',
        apiField: 'product_type',
        defaultExpanded: true,
        options: [
          { value: 'Hand Controls', label: 'Hand Controls' },
          { value: 'Foot Controls', label: 'Foot Controls' },
          { value: 'Levers', label: 'Levers' },
          { value: 'Grips', label: 'Grips' },
          { value: 'Mirrors', label: 'Mirrors' },
          { value: 'Accessories', label: 'General Accessories' }
        ]
      }
    ]
  },
  {
    categorySlug: 'body-styling',
    filters: [
      ...BASE_FILTERS,
      {
        key: 'product_type',
        label: 'Body Component',
        type: 'multi-select',
        apiField: 'product_type',
        defaultExpanded: true,
        options: [
          { value: 'Body', label: 'Body Panels' },
          { value: 'Windshield/Windscreen', label: 'Windshields' },
          { value: 'Graphics/Decals', label: 'Graphics & Decals' },
          { value: 'Seat', label: 'Seats' },
          { value: 'Storage Covers', label: 'Storage Covers' }
        ]
      }
    ]
  },
  {
    categorySlug: 'maintenance-tools',
    filters: [
      ...BASE_FILTERS,
      {
        key: 'product_type',
        label: 'Tool Type',
        type: 'multi-select',
        apiField: 'product_type',
        defaultExpanded: true,
        options: [
          { value: 'Tools', label: 'Hand Tools' },
          { value: 'Chemicals', label: 'Chemicals & Fluids' },
          { value: 'Stands/Lifts', label: 'Stands & Lifts' },
          { value: 'Utility Containers', label: 'Containers' },
          { value: 'Fuel Containers', label: 'Fuel Containers' }
        ]
      }
    ]
  },
  {
    categorySlug: 'storage-transport',
    filters: [
      ...BASE_FILTERS,
      {
        key: 'product_type',
        label: 'Storage Type',
        type: 'multi-select',
        apiField: 'product_type',
        defaultExpanded: true,
        options: [
          { value: 'Luggage', label: 'Luggage & Bags' },
          { value: 'Racks', label: 'Racks' },
          { value: 'Straps/Tie-Downs', label: 'Tie-Downs' },
          { value: 'Trailer/Towing', label: 'Trailer & Towing' },
          { value: 'Mounts/Brackets', label: 'Mounts & Brackets' }
        ]
      }
    ]
  },
  {
    categorySlug: 'specialty-vehicles',
    filters: [
      ...BASE_FILTERS,
      {
        key: 'product_type',
        label: 'Vehicle Type',
        type: 'multi-select',
        apiField: 'product_type',
        defaultExpanded: true,
        options: [
          { value: 'UTV Cab/Roof/Door', label: 'UTV Accessories' },
          { value: 'Skis/Carbides/Runners', label: 'Snowmobile Skis' },
          { value: 'Tracks', label: 'Tracks' },
          { value: 'Plow', label: 'Plows' },
          { value: 'Watercraft Towables', label: 'Watercraft' },
          { value: 'Winch', label: 'Winches' }
        ]
      }
    ]
  }
]

// Helper function to get filters for a specific category
export const getFiltersForCustomCategory = (categorySlug: string): FilterSchema[] => {
  const config = CUSTOM_CATEGORY_FILTERS.find(c => c.categorySlug === categorySlug)
  return config?.filters || BASE_FILTERS
}

// Helper function to get filter options for a specific filter in a category
export const getFilterOptions = (categorySlug: string, filterKey: string): FilterOption[] => {
  const filters = getFiltersForCustomCategory(categorySlug)
  const filter = filters.find(f => f.key === filterKey)
  return filter?.options || []
}

// Price range presets
export const PRICE_RANGE_PRESETS = [
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $250', min: 100, max: 250 },
  { label: '$250 - $500', min: 250, max: 500 },
  { label: '$500+', min: 500, max: null }
]