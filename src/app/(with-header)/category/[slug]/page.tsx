import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CategoryPage from '@/components/category/CategoryPage'

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

  return (
    <CategoryPage 
      slug={slug} 
      searchParams={resolvedSearchParams}
    />
  )
}