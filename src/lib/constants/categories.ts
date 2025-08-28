// Custom categories for Four Speed Motorcycle Shop
// Following WPS recommendations to create our own differentiated structure
import { CUSTOM_CATEGORIES } from './custom-categories'

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  itemCount?: number
  icon?: string
  gradient?: string
}

// Convert custom categories to legacy format for backward compatibility
export const WPS_CATEGORIES: Category[] = CUSTOM_CATEGORIES.map((cat) => ({
  id: cat.id,
  name: cat.name,
  slug: cat.slug,
  description: cat.description,
  itemCount: cat.itemCount,
  icon: cat.icon,
  gradient: cat.gradient,
}))

// Main categories are our custom categories
export const FALLBACK_CATEGORIES: Category[] = WPS_CATEGORIES

export const CATEGORY_VISUALS: Record<string, { icon: string; gradient: string }> = {
  'engine-performance': { icon: '⚙️', gradient: 'from-red-500 to-orange-600' },
  'suspension-handling': { icon: '🔧', gradient: 'from-blue-500 to-indigo-600' },
  'wheels-tires': { icon: '🛞', gradient: 'from-gray-500 to-slate-700' },
  'protective-gear': { icon: '🛡️', gradient: 'from-green-500 to-emerald-600' },
  'riding-apparel': { icon: '👕', gradient: 'from-purple-500 to-pink-600' },
  'brakes-drivetrain': { icon: '⚡', gradient: 'from-yellow-500 to-amber-600' },
  'electrical-lighting': { icon: '💡', gradient: 'from-cyan-500 to-blue-600' },
  'controls-accessories': { icon: '🎛️', gradient: 'from-indigo-500 to-purple-600' },
  'body-styling': { icon: '🎨', gradient: 'from-rose-500 to-pink-600' },
  'maintenance-tools': { icon: '🔨', gradient: 'from-orange-500 to-red-600' },
  'storage-transport': { icon: '🎒', gradient: 'from-teal-500 to-green-600' },
  'specialty-vehicles': { icon: '🏔️', gradient: 'from-slate-500 to-gray-600' },
}

// Helper function to get category visual
export const getCategoryVisual = (slug: string) => {
  const key = slug.toLowerCase()
  return CATEGORY_VISUALS[key] || { icon: '📦', gradient: 'from-steel-500 to-slate-600' }
}
