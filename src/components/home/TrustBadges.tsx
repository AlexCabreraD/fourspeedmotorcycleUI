export default function TrustBadges() {
  const badges = [
    { name: "Secure Checkout", icon: "🔒" },
    { name: "Fast Shipping", icon: "🚚" },
    { name: "Expert Support", icon: "💬" },
    { name: "Quality Guarantee", icon: "✅" },
    { name: "Easy Returns", icon: "↩️" }
  ]

  return (
    <section className="bg-white border-b border-steel-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center space-x-2 text-steel-600">
              <span className="text-xl">{badge.icon}</span>
              <span className="text-sm font-medium">{badge.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}