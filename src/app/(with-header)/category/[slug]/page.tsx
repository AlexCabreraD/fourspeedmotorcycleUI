import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'

// OPTIMIZED: Dynamic import for better performance
const OptimizedCategoryPage = dynamic(() => import('@/components/category/OptimizedCategoryPage'), {
  loading: () => (
    <div className='min-h-screen bg-steel-50 pt-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='animate-pulse'>
          <div className='h-6 bg-steel-200 rounded w-48 mb-6' />
          <div className='h-10 bg-steel-200 rounded w-64 mb-4' />
          <div className='h-4 bg-steel-200 rounded w-96 mb-8' />
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <div className='h-96 bg-steel-200 rounded' />
            <div className='md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[...Array(9)].map((_, i) => (
                <div key={i} className='h-80 bg-steel-200 rounded' />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
})

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  // In a real app, you'd fetch category data here for accurate metadata
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1)

  return {
    title: `${categoryName} Parts & Accessories | 4SpeedMotorcycle`,
    description: `Shop premium ${categoryName.toLowerCase()} parts, accessories, and gear. Fast shipping, expert support, and competitive prices.`,
    keywords: `${categoryName.toLowerCase()} parts, motorcycle ${categoryName.toLowerCase()}, ${categoryName.toLowerCase()} accessories`,
    openGraph: {
      title: `${categoryName} Parts & Accessories | 4SpeedMotorcycle`,
      description: `Shop premium ${categoryName.toLowerCase()} parts, accessories, and gear.`,
      type: 'website',
    },
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams

  // Validate slug format (basic validation)
  if (!slug || slug.length < 2) {
    notFound()
  }

  return <OptimizedCategoryPage slug={slug} searchParams={resolvedSearchParams} />
}
