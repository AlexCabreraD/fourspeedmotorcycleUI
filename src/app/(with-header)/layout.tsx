import Navigation from "@/components/layout/Navigation";
import CartSidebar from "@/components/cart/CartSidebar";

export default function WithHeaderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen relative">
        {children}
      </main>
      <CartSidebar />
      
      {/* Footer */}
      <footer className="bg-steel-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <img 
                src="/assets/4speedMotorcylceLogo.svg" 
                alt="4Speed Motorcycle" 
                className="h-12 w-auto mb-4"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <p className="text-steel-400 mb-4">
                Your trusted source for premium motorcycle parts, accessories, and gear. 
                We&apos;ve been serving riders since 1995 with quality parts and expert service.
              </p>
              <div className="text-steel-400">
                <p>Phone: 1-800-MOTO-PARTS</p>
                <p>Email: support@4speedmotorcycle.com</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-steel-400">
                <li><a href="/categories" className="hover:text-white transition-colors">Categories</a></li>
                <li><a href="/brands" className="hover:text-white transition-colors">Brands</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-steel-400">
                <li><a href="/shipping" className="hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="/returns" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="/warranty" className="hover:text-white transition-colors">Warranty</a></li>
                <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-steel-800 mt-8 pt-8 text-center text-steel-400">
            <p>&copy; 2024 4SpeedMotorcycle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}