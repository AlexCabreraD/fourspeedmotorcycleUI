'use client'

import { memo, useState, useCallback, useMemo } from 'react'
import { 
  Info, Package, Truck, Star, CheckCircle, RotateCcw
} from 'lucide-react'
import { WPSProduct, WPSItem } from '@/lib/api/wps-client'

interface ProductWithItems extends WPSProduct {
  items: WPSItem[]
}

interface OptimizedProductTabsProps {
  product: ProductWithItems
  selectedItem: WPSItem | null
}

type TabId = 'overview' | 'specifications' | 'shipping' | 'reviews'

interface Tab {
  id: TabId
  label: string
  icon: React.ComponentType<{ className?: string }>
}

// Memoized overview tab content
const OverviewTab = memo(({ 
  product, 
  selectedItem 
}: {
  product: ProductWithItems
  selectedItem: WPSItem | null
}) => {
  const stockStatus = useMemo(() => {
    if (!selectedItem) return { status: 'unknown', text: 'Unknown', color: 'text-steel-500' }
    
    switch (selectedItem.status) {
      case 'STK':
        return { status: 'in-stock', text: 'In Stock', color: 'text-green-600' }
      case 'LTD':
        return { status: 'limited', text: 'Limited Stock', color: 'text-yellow-600' }
      case 'OOS':
        return { status: 'out-of-stock', text: 'Out of Stock', color: 'text-red-600' }
      default:
        return { status: 'check', text: 'Check Availability', color: 'text-steel-500' }
    }
  }, [selectedItem?.status])

  return (
    <div className="space-y-8">
      {/* Product Description */}
      {product.description && (
        <div>
          <h3 className="text-xl font-bold text-steel-900 mb-4">Product Description</h3>
          <div className="prose prose-steel max-w-none">
            <p className="text-steel-700 leading-relaxed text-lg">{product.description}</p>
          </div>
        </div>
      )}

      {/* Key Features */}
      {selectedItem?.features && selectedItem.features.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-steel-900 mb-6">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedItem.features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-primary-50 to-blue-50 p-6 rounded-xl border border-primary-100">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-steel-900 mb-2">{feature.name}</h4>
                    {feature.description && (
                      <p className="text-steel-600 text-sm leading-relaxed">{feature.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Details Grid */}
      <div>
        <h3 className="text-xl font-bold text-steel-900 mb-6">Product Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-steel-50 p-6 rounded-xl">
            <h4 className="font-semibold text-steel-900 mb-4">General Information</h4>
            <div className="space-y-3">
              {selectedItem?.brand?.data && (
                <div className="flex justify-between py-2 border-b border-steel-200">
                  <span className="text-steel-600">Brand:</span>
                  <span className="font-medium">{selectedItem.brand.data.name}</span>
                </div>
              )}
              {selectedItem?.product_type && (
                <div className="flex justify-between py-2 border-b border-steel-200">
                  <span className="text-steel-600">Category:</span>
                  <span className="font-medium">{selectedItem.product_type}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-steel-200">
                <span className="text-steel-600">SKU:</span>
                <span className="font-medium font-mono">{selectedItem?.sku}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-steel-600">Availability:</span>
                <span className={`font-medium ${stockStatus.color}`}>{stockStatus.text}</span>
              </div>
            </div>
          </div>

          <div className="bg-steel-50 p-6 rounded-xl">
            <h4 className="font-semibold text-steel-900 mb-4">Physical Specifications</h4>
            <div className="space-y-3">
              {selectedItem?.length && (
                <div className="flex justify-between py-2 border-b border-steel-200">
                  <span className="text-steel-600">Length:</span>
                  <span className="font-medium">{selectedItem.length}"</span>
                </div>
              )}
              {selectedItem?.width && (
                <div className="flex justify-between py-2 border-b border-steel-200">
                  <span className="text-steel-600">Width:</span>
                  <span className="font-medium">{selectedItem.width}"</span>
                </div>
              )}
              {selectedItem?.height && (
                <div className="flex justify-between py-2 border-b border-steel-200">
                  <span className="text-steel-600">Height:</span>
                  <span className="font-medium">{selectedItem.height}"</span>
                </div>
              )}
              {selectedItem?.weight && (
                <div className="flex justify-between py-2">
                  <span className="text-steel-600">Weight:</span>
                  <span className="font-medium">{selectedItem.weight} lbs</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

OverviewTab.displayName = 'OverviewTab'

// Memoized specifications tab content
const SpecificationsTab = memo(({ selectedItem }: { selectedItem: WPSItem | null }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-steel-900">Technical Specifications</h3>
      <div className="bg-steel-50 p-6 rounded-xl">
        <div className="space-y-4">
          {selectedItem?.supplier_product_id && (
            <div className="flex justify-between py-3 border-b border-steel-200">
              <span className="text-steel-600 font-medium">Manufacturer Part #:</span>
              <span className="font-mono font-bold">{selectedItem.supplier_product_id}</span>
            </div>
          )}
          {selectedItem?.upc && (
            <div className="flex justify-between py-3 border-b border-steel-200">
              <span className="text-steel-600 font-medium">UPC:</span>
              <span className="font-mono">{selectedItem.upc}</span>
            </div>
          )}
          <div className="flex justify-between py-3 border-b border-steel-200">
            <span className="text-steel-600 font-medium">Product ID:</span>
            <span className="font-mono">{selectedItem?.id}</span>
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-6">
      <h3 className="text-xl font-bold text-steel-900">Dimensions & Weight</h3>
      <div className="bg-steel-50 p-6 rounded-xl">
        <div className="space-y-4">
          {selectedItem?.length && (
            <div className="flex justify-between py-3 border-b border-steel-200">
              <span className="text-steel-600 font-medium">Length:</span>
              <span className="font-bold">{selectedItem.length} inches</span>
            </div>
          )}
          {selectedItem?.width && (
            <div className="flex justify-between py-3 border-b border-steel-200">
              <span className="text-steel-600 font-medium">Width:</span>
              <span className="font-bold">{selectedItem.width} inches</span>
            </div>
          )}
          {selectedItem?.height && (
            <div className="flex justify-between py-3 border-b border-steel-200">
              <span className="text-steel-600 font-medium">Height:</span>
              <span className="font-bold">{selectedItem.height} inches</span>
            </div>
          )}
          {selectedItem?.weight && (
            <div className="flex justify-between py-3">
              <span className="text-steel-600 font-medium">Weight:</span>
              <span className="font-bold">{selectedItem.weight} lbs</span>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
))

SpecificationsTab.displayName = 'SpecificationsTab'

// Memoized shipping tab content
const ShippingTab = memo(() => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div className="bg-gradient-to-br from-blue-50 to-primary-50 p-8 rounded-xl border border-blue-200">
      <h3 className="text-xl font-bold text-steel-900 mb-6 flex items-center">
        <Truck className="h-6 w-6 text-blue-600 mr-3" />
        Shipping Information
      </h3>
      <div className="space-y-4 text-steel-700">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
          <span>Free shipping on orders over $99</span>
        </div>
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
          <span>Most orders ship same day when ordered before 3 PM EST</span>
        </div>
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
          <span>Expected delivery: 2-5 business days</span>
        </div>
      </div>
    </div>
    
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl border border-green-200">
      <h3 className="text-xl font-bold text-steel-900 mb-6 flex items-center">
        <RotateCcw className="h-6 w-6 text-green-600 mr-3" />
        Return Policy
      </h3>
      <div className="space-y-4 text-steel-700">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
          <span>30-day return policy</span>
        </div>
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
          <span>Items must be in original condition</span>
        </div>
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
          <span>Free return shipping on defective items</span>
        </div>
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
          <span>Restocking fee may apply to special orders</span>
        </div>
      </div>
    </div>
  </div>
))

ShippingTab.displayName = 'ShippingTab'

// Memoized reviews tab content
const ReviewsTab = memo(() => (
  <div className="space-y-8">
    {/* Review Summary */}
    <div className="bg-steel-50 p-8 rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-bold text-steel-900 mb-4">Customer Reviews</h3>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-6 w-6 ${i < 4 ? 'fill-current' : 'fill-steel-200'}`} />
              ))}
            </div>
            <span className="text-2xl font-bold text-steel-900">4.0</span>
            <span className="text-steel-600">Based on 23 reviews</span>
          </div>
          <button className="btn btn-outline">Write a Review</button>
        </div>
        
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-3">
              <span className="text-sm font-medium text-steel-600 w-8">{rating}★</span>
              <div className="flex-1 bg-steel-200 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${rating === 4 ? 60 : rating === 5 ? 30 : rating === 3 ? 10 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm text-steel-600 w-8">
                {rating === 4 ? '14' : rating === 5 ? '7' : rating === 3 ? '2' : '0'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Sample Reviews */}
    <div className="space-y-6">
      {[
        {
          name: 'Mike Rodriguez',
          rating: 5,
          date: '2 weeks ago',
          title: 'Excellent quality and fast shipping',
          review: 'This part exceeded my expectations. Perfect fit and excellent build quality. Shipping was fast and packaging was secure.'
        },
        {
          name: 'Sarah Chen',
          rating: 4,
          date: '1 month ago',
          title: 'Good value for money',
          review: 'Solid product at a competitive price. Installation was straightforward with the included instructions.'
        }
      ].map((review, index) => (
        <div key={index} className="bg-white border border-steel-200 p-6 rounded-xl">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="font-bold text-primary-600">{review.name[0]}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="font-semibold text-steel-900">{review.name}</span>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'fill-steel-200'}`} />
                  ))}
                </div>
                <span className="text-steel-500 text-sm">{review.date}</span>
              </div>
              <h4 className="font-semibold text-steel-900 mb-2">{review.title}</h4>
              <p className="text-steel-700">{review.review}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
))

ReviewsTab.displayName = 'ReviewsTab'

// Memoized tab navigation
const TabNavigation = memo(({ 
  tabs, 
  activeTab, 
  onTabChange 
}: {
  tabs: Tab[]
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}) => (
  <div className="border-b border-steel-200">
    <nav className="flex space-x-8 px-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors ${
            activeTab === tab.id
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-steel-600 hover:text-steel-900'
          }`}
        >
          <tab.icon className="h-5 w-5" />
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  </div>
))

TabNavigation.displayName = 'TabNavigation'

const OptimizedProductTabs = memo(function OptimizedProductTabs({
  product,
  selectedItem
}: OptimizedProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const tabs: Tab[] = useMemo(() => [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'specifications', label: 'Specifications', icon: Package },
    { id: 'shipping', label: 'Shipping & Returns', icon: Truck },
    { id: 'reviews', label: 'Reviews', icon: Star }
  ], [])

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab)
  }, [])

  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab product={product} selectedItem={selectedItem} />
      case 'specifications':
        return <SpecificationsTab selectedItem={selectedItem} />
      case 'shipping':
        return <ShippingTab />
      case 'reviews':
        return <ReviewsTab />
      default:
        return <OverviewTab product={product} selectedItem={selectedItem} />
    }
  }, [activeTab, product, selectedItem])

  return (
    <div className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden">
      <TabNavigation 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  )
})

OptimizedProductTabs.displayName = 'OptimizedProductTabs'

export default OptimizedProductTabs