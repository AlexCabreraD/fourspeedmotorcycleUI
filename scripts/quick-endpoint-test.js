const { config } = require("dotenv");
config({ path: ".env.local" });

/**
 * Flexible WPS API endpoint tester
 * Usage:
 *   node scripts/quick-endpoint-test.js [endpoint] key=value ...
 * Example:
 *   node scripts/quick-endpoint-test.js items page[size]=5 include=product filter[brand_id]=135 sort[desc]=list_price
 */

async function testSpecificEndpoint() {
  const args = process.argv.slice(2);
  const endpoint = args[0] || "vehiclemakes";

  const apiUrl = process.env.WPS_API_URL || process.env.NEXT_PUBLIC_WPS_API_URL;
  const apiToken = process.env.WPS_API_TOKEN || process.env.NEXT_PUBLIC_WPS_API_TOKEN;

  if (!apiUrl || !apiToken) {
    console.error("❌ Missing WPS API configuration");
    console.log("Please set WPS_API_URL and WPS_API_TOKEN in your .env.local file");
    process.exit(1);
  }

  // Build query parameters dynamically
  const queryParams = args.slice(1); // skip endpoint
  const queryString = queryParams.join("&");

  const url = `${apiUrl}/${endpoint}${queryParams.length ? "?" + queryString : ""}`;

  console.log(`🔍 Testing WPS API endpoint: /${endpoint}`);
  console.log(`📡 Fetching: ${url}`);
  console.log("");

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    console.log("✅ Response received!\n");
    console.log("📊 FULL RESPONSE STRUCTURE:");
    console.log("=".repeat(50));
    console.log(JSON.stringify(data, null, 2));
    console.log("=".repeat(50));

    // Basic analysis
    console.log("\n🔍 QUICK ANALYSIS:");

    let imageUrls = [];
    const isImageEndpoint = endpoint.toLowerCase().startsWith("images");

    const extractImageUrls = (arr) =>
        arr
            .filter((item) => item.domain && item.path && item.filename)
            .map((item) => `${item.domain}${item.path}${item.filename}`);

    if (data.data && Array.isArray(data.data)) {
      console.log(`• Type: Array in 'data' property`);
      console.log(`• Count: ${data.data.length} items`);
      if (data.data.length > 0) {
        const firstItem = data.data[0];
        console.log(`• First item keys: ${Object.keys(firstItem).join(", ")}`);
        console.log(`• Sample item:`, firstItem);
      }
      if (isImageEndpoint) imageUrls = extractImageUrls(data.data);
    } else if (Array.isArray(data)) {
      console.log(`• Type: Direct array`);
      console.log(`• Count: ${data.length} items`);
      if (data.length > 0) {
        console.log(`• First item keys: ${Object.keys(data[0]).join(", ")}`);
        console.log(`• Sample item:`, data[0]);
      }
      if (isImageEndpoint) imageUrls = extractImageUrls(data);
    } else if (data.data && typeof data.data === "object") {
      console.log(`• Type: Single object in 'data' property`);
      console.log(`• Object keys: ${Object.keys(data.data).join(", ")}`);
      console.log(`• Sample object:`, data.data);
      if (isImageEndpoint && data.data.domain && data.data.path && data.data.filename) {
        imageUrls = [`${data.data.domain}${data.data.path}${data.data.filename}`];
      }
    } else {
      console.log(`• Type: Direct object`);
      console.log(`• Object keys: ${Object.keys(data).join(", ")}`);
    }

    if (data.meta) {
      console.log(`\n📋 Meta info:`, data.meta);
    }

    if (data.links) {
      console.log(`\n🔗 Pagination:`, data.links);
    }

    if (isImageEndpoint && imageUrls.length > 0) {
      console.log(`\n🖼️ Image URLs:\n${imageUrls.join("\n")}`);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.log("\n🛠️ Troubleshooting:");
    console.log("• Check if the endpoint name is correct");
    console.log("• Verify your API token has access to this endpoint");
    console.log("• Try: vehiclemakes, vehiclemodels, items, vehicles, images");
  }
}

if (process.argv.length === 2) {
  console.log("Usage: node scripts/quick-endpoint-test.js [endpoint] key=value ...");
  console.log("\nExamples:");
  console.log("  node scripts/quick-endpoint-test.js vehiclemakes");
  console.log("  node scripts/quick-endpoint-test.js items page[size]=5 include=product");
  console.log("  node scripts/quick-endpoint-test.js items filter[brand_id]=135 sort[desc]=list_price");
  process.exit(0);
}

testSpecificEndpoint();
