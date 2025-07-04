// Test script to see what product types actually exist
const fetch = require('node-fetch')

async function checkProductTypes() {
  try {
    console.log('Fetching products to see actual product types...')
    
    const response = await fetch('http://localhost:3000/api/products?page=50') // Get more items
    const data = await response.json()
    
    if (!data.success) {
      console.log('API Error:', data.error)
      return
    }
    
    const productTypes = new Set()
    let totalItems = 0
    
    data.data.forEach(product => {
      if (product.items && product.items.data) {
        product.items.data.forEach(item => {
          if (item.product_type) {
            productTypes.add(item.product_type)
          }
          totalItems++
        })
      }
    })
    
    console.log(`\nFound ${totalItems} total items`)
    console.log(`\nUnique product types found (${productTypes.size}):`)
    
    const sortedTypes = Array.from(productTypes).sort()
    sortedTypes.forEach((type, i) => {
      console.log(`  ${i+1}. ${type}`)
    })
    
    // Check for apparel-related types
    console.log('\n=== Apparel-related types ===')
    const apparelTypes = sortedTypes.filter(type => 
      type.toLowerCase().includes('helmet') ||
      type.toLowerCase().includes('jacket') ||
      type.toLowerCase().includes('glove') ||
      type.toLowerCase().includes('boot') ||
      type.toLowerCase().includes('apparel') ||
      type.toLowerCase().includes('gear') ||
      type.toLowerCase().includes('clothing') ||
      type.toLowerCase().includes('protective') ||
      type.toLowerCase().includes('eyewear')
    )
    
    if (apparelTypes.length > 0) {
      apparelTypes.forEach(type => console.log(`  - ${type}`))
    } else {
      console.log('  No obvious apparel types found')
    }
    
  } catch (error) {
    console.error('Test failed:', error.message)
  }
}

checkProductTypes()