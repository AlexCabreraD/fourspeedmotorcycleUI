// Quick test script to verify apparel filtering
const fetch = require('node-fetch')

async function testApparelFiltering() {
  try {
    console.log('Testing Apparel category filtering...')
    
    // Test 1: Single product type
    const response1 = await fetch('http://localhost:3000/api/products?product_type=Helmets&page=5')
    const data1 = await response1.json()
    
    console.log('\n=== Single Product Type (Helmets) ===')
    console.log('Success:', data1.success)
    console.log('Items found:', data1.data?.length || 0)
    if (data1.data?.[0]?.items?.data) {
      console.log('Sample items:')
      data1.data[0].items.data.slice(0, 3).forEach((item, i) => {
        console.log(`  ${i+1}. ${item.name} (${item.product_type})`)
      })
    }
    
    // Test 2: Multiple product types (comma-separated)
    const response2 = await fetch('http://localhost:3000/api/products?product_type=Helmets,Jackets,Gloves&page=5')
    const data2 = await response2.json()
    
    console.log('\n=== Multiple Product Types (Helmets,Jackets,Gloves) ===')
    console.log('Success:', data2.success)
    console.log('Items found:', data2.data?.length || 0)
    if (data2.data?.[0]?.items?.data) {
      console.log('Sample items:')
      data2.data[0].items.data.slice(0, 3).forEach((item, i) => {
        console.log(`  ${i+1}. ${item.name} (${item.product_type})`)
      })
    }
    
    // Test 3: What we get without filtering
    const response3 = await fetch('http://localhost:3000/api/products?page=5')
    const data3 = await response3.json()
    
    console.log('\n=== No Product Type Filter ===')
    console.log('Success:', data3.success)
    console.log('Items found:', data3.data?.length || 0)
    if (data3.data?.[0]?.items?.data) {
      console.log('Sample items:')
      data3.data[0].items.data.slice(0, 3).forEach((item, i) => {
        console.log(`  ${i+1}. ${item.name} (${item.product_type})`)
      })
    }
    
  } catch (error) {
    console.error('Test failed:', error.message)
  }
}

testApparelFiltering()