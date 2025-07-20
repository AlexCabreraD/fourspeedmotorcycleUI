interface ProductCardSkeletonProps {
  viewMode?: 'grid' | 'list'
}

export default function ProductCardSkeleton({ viewMode = 'grid' }: ProductCardSkeletonProps) {
  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-steel-200 rounded-lg overflow-hidden animate-pulse">
        <div className="flex">
          {/* Image Skeleton */}
          <div className="w-48 h-48 bg-gradient-to-br from-steel-200 via-steel-300 to-steel-200 flex-shrink-0" />
          
          {/* Content Skeleton */}
          <div className="flex-1 p-6">
            {/* Title */}
            <div className="h-6 bg-steel-300 rounded w-3/4 mb-3" />
            <div className="h-4 bg-steel-200 rounded w-1/2 mb-4" />
            
            {/* Product Type */}
            <div className="h-3 bg-steel-200 rounded w-1/4 mb-4" />
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="h-4 bg-yellow-200 rounded w-20 mr-2" />
              <div className="h-3 bg-steel-200 rounded w-16" />
            </div>
            
            {/* Price */}
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-green-200 rounded w-20" />
              <div className="h-4 bg-steel-200 rounded w-16" />
            </div>
            
            {/* Features */}
            <div className="space-y-2 mb-4">
              <div className="h-3 bg-steel-200 rounded w-full" />
              <div className="h-3 bg-steel-200 rounded w-2/3" />
            </div>
            
            {/* Buttons */}
            <div className="flex gap-2">
              <div className="h-10 bg-orange-200 rounded-lg flex-1" />
              <div className="h-10 w-10 bg-steel-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid view skeleton
  return (
    <div className="bg-white border border-steel-200 rounded-lg overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-product bg-gradient-to-br from-steel-200 via-steel-300 to-steel-200" />
      
      {/* Content Skeleton */}
      <div className="p-4">
        {/* Title */}
        <div className="h-4 bg-steel-300 rounded w-3/4 mb-2" />
        <div className="h-4 bg-steel-200 rounded w-1/2 mb-3" />
        
        {/* Rating and Price */}
        <div className="flex justify-between items-center mb-3">
          <div className="h-4 bg-yellow-200 rounded w-16" />
          <div className="h-4 bg-steel-200 rounded w-12" />
        </div>
        
        {/* Price */}
        <div className="h-6 bg-green-200 rounded w-20 mb-4" />
        
        {/* Features */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-steel-200 rounded w-full" />
          <div className="h-3 bg-steel-200 rounded w-2/3" />
        </div>
        
        {/* Button */}
        <div className="h-10 bg-orange-200 rounded-lg w-full" />
      </div>
    </div>
  )
}