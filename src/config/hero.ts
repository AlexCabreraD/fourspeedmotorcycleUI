export interface HeroSlide {
  id: number
  title: string
  subtitle: string
  description: string
  cta: string
  ctaLink: string
  secondaryBtn?: {
    text: string
    link: string
  }
  background: string
  image?: string
  enabled: boolean
}

export interface HeroStats {
  customers: string
  parts: string
  experience: string
}

export interface HeroConfig {
  slides: HeroSlide[]
  stats: HeroStats
  autoPlay: boolean
  slideInterval: number // in milliseconds
}

export const heroConfig: HeroConfig = {
  autoPlay: true,
  slideInterval: 5000,
  stats: {
    customers: '50K+',
    parts: '100K+',
    experience: '25+',
  },
  slides: [
    {
      id: 1,
      enabled: true,
      title: 'Premium Motorcycle Parts',
      subtitle: 'Performance & Style Combined',
      description:
        "Discover our extensive collection of high-quality motorcycle parts from the industry's leading brands.",
      cta: 'Shop Parts',
      ctaLink: '/categories',
      secondaryBtn: {
        text: 'Find Parts',
        link: '/products',
      },
      background: 'bg-gradient-to-r from-steel-900 via-steel-800 to-primary-900',
      image: '/images/hero/HardDrive-077.JPG',
    },
    {
      id: 2,
      enabled: true,
      title: 'New Arrivals',
      subtitle: 'Latest Gear & Accessories',
      description:
        'Check out the newest additions to our inventory. Fresh parts, gear, and accessories just arrived.',
      cta: 'View New Arrivals',
      ctaLink: '/new-arrivals',
      secondaryBtn: {
        text: 'Find Parts',
        link: '/products',
      },
      background: 'bg-gradient-to-r from-primary-900 via-primary-800 to-accent-900',
      image: '/images/hero/HardDrive-112.JPG',
    },
    {
      id: 3,
      enabled: true,
      title: 'Winter Sale',
      subtitle: 'Up to 40% Off Select Items',
      description:
        "Don't miss out on our biggest sale of the year. Limited time offers on premium motorcycle parts.",
      cta: 'Shop Sale',
      ctaLink: '/sale',
      secondaryBtn: {
        text: 'Find Parts',
        link: '/products',
      },
      background: 'bg-gradient-to-r from-accent-900 via-accent-800 to-primary-900',
      image: '/images/hero/RST2024-091.JPG',
    },
  ],
}
