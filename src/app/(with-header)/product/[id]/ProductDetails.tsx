'use client'

import OptimizedProductPage from '@/components/product/OptimizedProductPage'

interface Props {
  params: Promise<{ id: string }>
}

export default function ProductDetails({ params }: Props) {
  return <OptimizedProductPage params={params} />
}
