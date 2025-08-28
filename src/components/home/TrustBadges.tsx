import { Lock, MessageCircle, RotateCcw, Shield, Truck } from 'lucide-react'

export default function TrustBadges() {
  const badges = [
    { name: 'Secure Checkout', icon: Lock, image: 'mechanic-tools' },
    { name: 'Fast Shipping', icon: Truck, image: 'shipping-warehouse' },
    { name: 'Expert Support', icon: MessageCircle, image: 'mechanic-consultation' },
    { name: 'Quality Guarantee', icon: Shield, image: 'quality-parts' },
    { name: 'Easy Returns', icon: RotateCcw, image: 'customer-service' },
  ]

  return (
    <section className='py-12 bg-steel-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-2 md:grid-cols-5 gap-8'>
          {badges.map((badge, index) => {
            const IconComponent = badge.icon
            return (
              <div key={index} className='text-center group'>
                <div className='w-16 h-16 bg-steel-800 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-200'>
                  <IconComponent className='h-6 w-6 text-steel-300 group-hover:text-white' />
                </div>
                <h3 className='text-white font-bold text-sm uppercase tracking-wide'>
                  {badge.name}
                </h3>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
