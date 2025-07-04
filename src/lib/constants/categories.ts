// Real WPS taxonomy categories - these are the actual categories from the WPS API
export interface Category {
  id: number
  vocabulary_id?: number
  parent_id?: number | null
  name: string
  slug: string
  description?: string | null
  itemCount?: number
  left?: number
  right?: number
  depth?: number
  created_at?: string
  updated_at?: string
}

// Real categories from WPS API (filtering out brand-specific ones)
export const WPS_CATEGORIES: Category[] = [
  { id: 192, vocabulary_id: 15, parent_id: null, name: 'Apparel', slug: 'apparel', description: 'Riding gear, helmets, jackets, and protective equipment', left: 1, right: 2, depth: 0 },
  { id: 193, vocabulary_id: 15, parent_id: null, name: 'ATV', slug: 'atv', description: 'ATV parts, accessories, and maintenance items', left: 3, right: 4, depth: 0 },
  { id: 194, vocabulary_id: 15, parent_id: null, name: 'Bicycle', slug: 'bicycle', description: 'Bicycle components, accessories, and gear', left: 5, right: 6, depth: 0 },
  { id: 197, vocabulary_id: 15, parent_id: null, name: 'Offroad', slug: 'offroad', description: 'Dirt bike and offroad motorcycle parts', left: 11, right: 12, depth: 0 },
  { id: 198, vocabulary_id: 15, parent_id: null, name: 'Snow', slug: 'snow', description: 'Snowmobile parts and winter riding gear', left: 13, right: 14, depth: 0 },
  { id: 199, vocabulary_id: 15, parent_id: null, name: 'Street', slug: 'street', description: 'Street bike parts, accessories, and performance upgrades', left: 15, right: 16, depth: 0 },
  { id: 200, vocabulary_id: 15, parent_id: null, name: 'Watercraft', slug: 'watercraft', description: 'Jet ski and watercraft parts and accessories', left: 17, right: 18, depth: 0 }
]

// Fallback categories for when WPS API isn't available
export const FALLBACK_CATEGORIES: Category[] = WPS_CATEGORIES

export const CATEGORY_VISUALS: Record<string, { icon: string; gradient: string }> = {
  'apparel': { icon: '👕', gradient: 'from-blue-500 to-purple-600' },
  'atv': { icon: '🏍️', gradient: 'from-green-500 to-teal-600' },
  'bicycle': { icon: '🚴', gradient: 'from-yellow-500 to-orange-600' },
  'offroad': { icon: '🏔️', gradient: 'from-red-500 to-pink-600' },
  'snow': { icon: '❄️', gradient: 'from-cyan-500 to-blue-600' },
  'street': { icon: '🏙️', gradient: 'from-gray-500 to-slate-600' },
  'watercraft': { icon: '🚤', gradient: 'from-indigo-500 to-blue-600' },
  'engine-parts': { icon: '⚙️', gradient: 'from-orange-500 to-red-600' },
  'tires-wheels': { icon: '🛞', gradient: 'from-slate-500 to-gray-600' },
  'electrical': { icon: '⚡', gradient: 'from-yellow-500 to-amber-600' },
  'suspension': { icon: '🔧', gradient: 'from-purple-500 to-indigo-600' },
  'exhaust': { icon: '💨', gradient: 'from-rose-500 to-pink-600' }
}

// Helper function to get category visual
export const getCategoryVisual = (slug: string) => {
  const key = slug.toLowerCase()
  return CATEGORY_VISUALS[key] || { icon: '📦', gradient: 'from-steel-500 to-slate-600' }
}