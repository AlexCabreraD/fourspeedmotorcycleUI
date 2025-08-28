'use client'

import { CheckCircle, Info, Package, RotateCcw, Truck } from 'lucide-react'
import { memo, useCallback, useMemo, useState } from 'react'

import { WPSItem, WPSProduct } from '@/lib/api/wps-client'

interface ProductWithItems extends WPSProduct {
  items: WPSItem[]
}

interface OptimizedProductTabsProps {
  product: ProductWithItems
  selectedItem: WPSItem | null
}

type TabId = 'overview' | 'specifications' | 'shipping'

interface Tab {
  id: TabId
  label: string
  icon: React.ComponentType<{ className?: string }>
}

// Memoized overview tab content
const OverviewTab = memo(
  ({ product, selectedItem }: { product: ProductWithItems; selectedItem: WPSItem | null }) => {
    const stockStatus = useMemo(() => {
      if (!selectedItem) {
        return { status: 'unknown', text: 'Unknown', color: 'text-steel-500' }
      }

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
      <div className='space-y-6'>
        {/* Product Description */}
        {product.description && (
          <div>
            <h3 className='text-base font-display font-semibold text-steel-900 mb-2'>
              Product Description
            </h3>
            <div className='prose prose-steel max-w-none'>
              <p className='text-steel-700 leading-relaxed'>{product.description}</p>
            </div>
          </div>
        )}

        {/* Key Features */}
        {selectedItem?.features && selectedItem.features.length > 0 && (
          <div>
            <h3 className='text-base font-display font-semibold text-steel-900 mb-3'>
              Key Features
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
              {selectedItem.features.map((feature, index) => (
                <div key={index} className='bg-primary-50 p-3 rounded border border-primary-100'>
                  <div className='flex items-start space-x-2'>
                    <CheckCircle className='h-4 w-4 text-primary-600 flex-shrink-0 mt-0.5' />
                    <div>
                      <h4 className='font-medium text-steel-900 text-sm mb-1'>{feature.name}</h4>
                      {feature.description && (
                        <p className='text-steel-600 text-xs leading-relaxed'>
                          {feature.description}
                        </p>
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
          <h3 className='text-base font-display font-semibold text-steel-900 mb-3'>
            Product Details
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <div className='bg-steel-50 p-3 rounded border border-steel-200'>
              <h4 className='font-medium text-steel-900 text-sm mb-2'>General Information</h4>
              <div className='space-y-3'>
                {selectedItem?.brand?.data && (
                  <div className='flex justify-between py-1.5 border-b border-steel-200'>
                    <span className='text-steel-600 text-sm'>Brand:</span>
                    <span className='font-medium text-sm'>{selectedItem.brand.data.name}</span>
                  </div>
                )}
                {selectedItem?.product_type && (
                  <div className='flex justify-between py-1.5 border-b border-steel-200'>
                    <span className='text-steel-600 text-sm'>Category:</span>
                    <span className='font-medium text-sm'>{selectedItem.product_type}</span>
                  </div>
                )}
                <div className='flex justify-between py-1.5 border-b border-steel-200'>
                  <span className='text-steel-600 text-sm'>SKU:</span>
                  <span className='font-medium font-mono text-sm'>{selectedItem?.sku}</span>
                </div>
                <div className='flex justify-between py-1.5'>
                  <span className='text-steel-600 text-sm'>Availability:</span>
                  <span className={`font-medium text-sm ${stockStatus.color}`}>
                    {stockStatus.text}
                  </span>
                </div>
              </div>
            </div>

            <div className='bg-steel-50 p-3 rounded border border-steel-200'>
              <h4 className='font-medium text-steel-900 text-sm mb-2'>Physical Specifications</h4>
              <div className='space-y-3'>
                {selectedItem?.length && (
                  <div className='flex justify-between py-2 border-b border-steel-200'>
                    <span className='text-steel-600'>Length:</span>
                    <span className='font-medium'>{selectedItem.length}"</span>
                  </div>
                )}
                {selectedItem?.width && (
                  <div className='flex justify-between py-2 border-b border-steel-200'>
                    <span className='text-steel-600'>Width:</span>
                    <span className='font-medium'>{selectedItem.width}"</span>
                  </div>
                )}
                {selectedItem?.height && (
                  <div className='flex justify-between py-2 border-b border-steel-200'>
                    <span className='text-steel-600'>Height:</span>
                    <span className='font-medium'>{selectedItem.height}"</span>
                  </div>
                )}
                {selectedItem?.weight && (
                  <div className='flex justify-between py-2'>
                    <span className='text-steel-600'>Weight:</span>
                    <span className='font-medium'>{selectedItem.weight} lbs</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

OverviewTab.displayName = 'OverviewTab'

// Memoized specifications tab content
const SpecificationsTab = memo(({ selectedItem }: { selectedItem: WPSItem | null }) => (
  <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
    <div className='space-y-6'>
      <h3 className='text-lg font-display font-semibold text-steel-900'>
        Technical Specifications
      </h3>
      <div className='bg-steel-50 p-4 rounded-lg'>
        <div className='space-y-4'>
          {selectedItem?.supplier_product_id && (
            <div className='flex justify-between py-3 border-b border-steel-200'>
              <span className='text-steel-600 font-medium'>Manufacturer Part #:</span>
              <span className='font-mono font-bold'>{selectedItem.supplier_product_id}</span>
            </div>
          )}
          {selectedItem?.upc && (
            <div className='flex justify-between py-3 border-b border-steel-200'>
              <span className='text-steel-600 font-medium'>UPC:</span>
              <span className='font-mono'>{selectedItem.upc}</span>
            </div>
          )}
          <div className='flex justify-between py-3 border-b border-steel-200'>
            <span className='text-steel-600 font-medium'>Product ID:</span>
            <span className='font-mono'>{selectedItem?.id}</span>
          </div>
        </div>
      </div>
    </div>

    <div className='space-y-6'>
      <h3 className='text-lg font-display font-semibold text-steel-900'>Dimensions & Weight</h3>
      <div className='bg-steel-50 p-4 rounded-lg'>
        <div className='space-y-4'>
          {selectedItem?.length && (
            <div className='flex justify-between py-3 border-b border-steel-200'>
              <span className='text-steel-600 font-medium'>Length:</span>
              <span className='font-bold'>{selectedItem.length} inches</span>
            </div>
          )}
          {selectedItem?.width && (
            <div className='flex justify-between py-3 border-b border-steel-200'>
              <span className='text-steel-600 font-medium'>Width:</span>
              <span className='font-bold'>{selectedItem.width} inches</span>
            </div>
          )}
          {selectedItem?.height && (
            <div className='flex justify-between py-3 border-b border-steel-200'>
              <span className='text-steel-600 font-medium'>Height:</span>
              <span className='font-bold'>{selectedItem.height} inches</span>
            </div>
          )}
          {selectedItem?.weight && (
            <div className='flex justify-between py-3'>
              <span className='text-steel-600 font-medium'>Weight:</span>
              <span className='font-bold'>{selectedItem.weight} lbs</span>
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
  <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
    <div className='bg-primary-50 p-6 rounded-lg border border-primary-200'>
      <h3 className='text-lg font-display font-semibold text-steel-900 mb-4 flex items-center'>
        <Truck className='h-5 w-5 text-primary-600 mr-2' />
        Shipping Information
      </h3>
      <div className='space-y-3 text-steel-700 text-sm'>
        <div className='flex items-start space-x-2'>
          <CheckCircle className='h-3 w-3 text-accent-600 flex-shrink-0 mt-0.5' />
          <span>Free shipping on orders over $99</span>
        </div>
        <div className='flex items-start space-x-2'>
          <CheckCircle className='h-3 w-3 text-accent-600 flex-shrink-0 mt-0.5' />
          <span>Most orders ship same day when ordered before 3 PM EST</span>
        </div>
        <div className='flex items-start space-x-2'>
          <CheckCircle className='h-3 w-3 text-accent-600 flex-shrink-0 mt-0.5' />
          <span>Expected delivery: 2-5 business days</span>
        </div>
      </div>
    </div>

    <div className='bg-accent-50 p-6 rounded-lg border border-accent-200'>
      <h3 className='text-lg font-display font-semibold text-steel-900 mb-4 flex items-center'>
        <RotateCcw className='h-5 w-5 text-accent-600 mr-2' />
        Return Policy
      </h3>
      <div className='space-y-3 text-steel-700 text-sm'>
        <div className='flex items-start space-x-2'>
          <CheckCircle className='h-3 w-3 text-accent-600 flex-shrink-0 mt-0.5' />
          <span>30-day return policy</span>
        </div>
        <div className='flex items-start space-x-2'>
          <CheckCircle className='h-3 w-3 text-accent-600 flex-shrink-0 mt-0.5' />
          <span>Items must be in original condition</span>
        </div>
        <div className='flex items-start space-x-2'>
          <CheckCircle className='h-3 w-3 text-accent-600 flex-shrink-0 mt-0.5' />
          <span>Free return shipping on defective items</span>
        </div>
        <div className='flex items-start space-x-2'>
          <Info className='h-4 w-4 text-primary-600 flex-shrink-0 mt-0.5' />
          <span>Restocking fee may apply to special orders</span>
        </div>
      </div>
    </div>
  </div>
))

ShippingTab.displayName = 'ShippingTab'

// Memoized tab navigation
const TabNavigation = memo(
  ({
    tabs,
    activeTab,
    onTabChange,
  }: {
    tabs: Tab[]
    activeTab: TabId
    onTabChange: (tab: TabId) => void
  }) => (
    <div className='bg-steel-50 border-b border-steel-200'>
      <nav className='flex space-x-1 px-6 py-4'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white shadow-card'
                : 'bg-white text-steel-600 hover:text-steel-900 hover:bg-steel-100 border border-steel-200'
            }`}
          >
            <tab.icon className='h-4 w-4' />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
)

TabNavigation.displayName = 'TabNavigation'

const OptimizedProductTabs = memo(function OptimizedProductTabs({
  product,
  selectedItem,
}: OptimizedProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const tabs: Tab[] = useMemo(
    () => [
      { id: 'overview', label: 'Overview', icon: Info },
      { id: 'specifications', label: 'Specifications', icon: Package },
      { id: 'shipping', label: 'Shipping & Returns', icon: Truck },
    ],
    []
  )

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
      default:
        return <OverviewTab product={product} selectedItem={selectedItem} />
    }
  }, [activeTab, product, selectedItem])

  return (
    <div className='card overflow-hidden'>
      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

      <div className='p-4'>{renderTabContent()}</div>
    </div>
  )
})

OptimizedProductTabs.displayName = 'OptimizedProductTabs'

export default OptimizedProductTabs
