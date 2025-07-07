import { Metadata } from 'next'
import ProductDetails from './ProductDetails'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_WPS_API_URL || 'http://localhost:3000'}/api/products/${id}`)
    const data = await response.json()
    
    if (data.success && data.data) {
      const product = data.data
      const selectedItem = product.items?.[0]
      
      return {
        title: `${product.name} | 4Speed Motorcycle`,
        description: product.description || `Buy ${product.name} at 4Speed Motorcycle. High-quality motorcycle parts and accessories.`,
        keywords: [
          product.name,
          selectedItem?.brand?.data?.name,
          'motorcycle parts',
          'motorcycle accessories',
          '4speed motorcycle'
        ].filter(Boolean).join(', '),
        openGraph: {
          title: product.name,
          description: product.description || `High-quality ${product.name} available at 4Speed Motorcycle`,
          type: 'product',
          images: selectedItem?.images?.length ? [selectedItem.images[0].path] : []
        }
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }
  
  return {
    title: 'Product | 4Speed Motorcycle',
    description: 'Quality motorcycle parts and accessories at 4Speed Motorcycle'
  }
}

export default function ProductPage({ params }: Props) {
  return <ProductDetails params={params} />
}