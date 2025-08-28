import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface BreadcrumbItem {
  name: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className='flex items-center space-x-2 text-sm text-steel-600 mb-6'>
      {items.map((item, index) => (
        <div key={index} className='flex items-center'>
          {index > 0 && <ChevronRight className='h-4 w-4 mx-2 text-steel-400' />}
          {index === items.length - 1 ? (
            <span className='text-steel-900 font-medium'>{item.name}</span>
          ) : (
            <Link href={item.href} className='hover:text-primary-600 transition-colors'>
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
