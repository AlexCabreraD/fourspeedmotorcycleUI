'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Grid, List, Search, Package, Filter, X, ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { WPSItem, ImageUtils } from '@/lib/api/wps-client'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'

// All available brands from documentation
const ALL_BRANDS = [
  'PATRIOT', 'BOLT', 'SHINDY', 'RASCAL GRAFIK', 'FLY RACING', 'RISK RACING', 'FIRE POWER', 'BEER OPTICS', 'EKS BRAND', 'DIRT DIGITS',
  'SUNSTAR', 'KFI', 'SPORTECH', 'POWERMADD', 'EMGO', 'K&S', 'PDP', 'MIGHTY MINI', 'SP1', 'WPS', 'ISC', 'BLUHM', 'STRIDER', 'WISECO',
  'CAMSO', 'YAKTRAX', 'AMERICAN MFG', 'POWERTYE', 'EPI', 'KORONIS', 'GARLAND', 'SLP', 'STRAIGHTLINE', 'WOODYS', 'HMK', 'HARDLINE',
  'BAFFIN', 'K&L', 'EBC', 'SKF', 'FLUIDYNE', 'MOTION PRO', 'CANDLEPOWER', 'CHRIS PRODUCTS', 'MIKUNI', 'VERTEX', 'WSM', 'WALBRO',
  'VISU-FILTER', 'KELCH', 'FULL THROTTLE', 'SPG', 'ROX', 'SNACKERPACKERS', 'PPD', 'WAHL BROS', 'SUDCO', 'STREETFX', 'LIL LIGHTNING',
  'CYCLE SOUNDS', 'ATLANTIS', 'PUTCO', 'VOODOO', 'OPEN TRAIL', 'FLIP', 'AXIA', 'MOTO HOSE', 'SMOOTH', 'FLO MOTORSPORTS', 'ACERBIS',
  'FUSION', 'SPEAQUA', 'DOBECK', 'FACTORY PRO', 'DAYTONA', 'DYNATEK', 'DYNOJET', 'TECHMOUNT', 'KYB', 'XTRIG', 'HELIX', 'NORMA',
  'HELLA MARINE', 'NGK', 'FRAM', 'PCRACING', 'ALL BALLS', 'SNOSTUFF', 'STACOOL', 'OTTP', 'BTL DESIGNS', 'SLYDOG', 'CURVE', 'C&A',
  'HINSON', 'KG', 'ROETIN', 'STUD BOY', 'GALFER', 'MAGURA', 'STREAMLINE', 'R&D', 'BLOWSION', 'HYDRO-TURF', 'HOT PRODUCTS', 'HT MOTO',
  'KOLD KUTTER', 'KWIK TEK', 'AIRHEAD', 'SUPERCROSS', 'BOX', 'HSL', 'MACK STUDS', 'BRONCO', 'NAMURA', 'PROX', 'SOLAS', 'DSS',
  'FOUR TWELVE', 'KPMI', 'X2', 'WORX', 'RACE TECH', 'COMET', 'MIKA METALS', 'ODI', 'ULTIMAX', 'DAYCO', 'JETTRIBE', 'PATHFINDER',
  'RULE', 'JETWORKS', 'KOLPIN', 'BMP', 'PRO ARMOR', 'FROGZ SKIN', 'BDX', 'MBRP', 'SHOCKPROS', 'OUTERWEARS', 'RENTHAL', 'HARDDRIVE',
  'ZAN', 'BOBSTER', 'RYDER CLIPS', 'MECHANIX', 'MISSING LINK', 'RZ MASK', 'PRO DESIGN', 'ZEE LINE', 'EAZYMOVE', 'PIVOT WORKS',
  'RICKS', 'STA-BIL', 'CLYMER', 'MXL', 'ECHO', 'HANDY', 'WD-40', 'REVIVEX', 'LITTLE HOTTIES', 'GRABBER', 'SURE GRIP', 'CLASSIC ACC.',
  'COM. SEWING', 'SUPERCADDY', 'SNO-SKINZ', 'GEARS', 'MASQUE', 'TEKVEST', 'KREEM', 'TRI-FLOW', 'PROTECT ALL', 'COMP. CHEM.',
  'HELMET FRESH', 'PLEXUS', 'WORKSHOP HERO', 'MAXIMA', 'DOWCO', 'KOSO', 'MONKEY GRIP', 'COVERCRAFT', 'HEAROS', 'CHASE HARPER',
  'NELSON-RIGG', 'GIVI', 'MSD', 'BULLY DOG', 'CYCLE ELECTRIC', 'ACCEL', 'SMP', 'LUNATI', 'BAZZAZ', 'SPEED-WAY SHELT', 'SDC',
  'GEARBRAKE', 'NO-SPILL', 'RATIO RITE', 'TUFF JUG', 'LC', 'MIDWEST CAN', 'CANYON DANCER', 'MODQUAD', 'UPP', 'HELIBARS',
  'QUICKLOADER', 'CALIBER', 'LOCKSTRAPS', 'SNOBUNJE', 'ANCRA', 'MOTO-GATE', 'CFR', 'HIGH ROLLER', 'AQUACART', 'CONDOR', 'VORTEX',
  'VENOM PRODUCTS', 'BRAKING', 'K&N', 'SAFETY', 'FIRESTIK', 'WHIP IT', 'HIGHWAY 21', 'TRIPLE 9', 'KLEER VU', 'AMMCO', 'FIX-A-THRED',
  'HAYDEN', 'AUTOLITE', 'COUNTRY ENT.', 'HEAT DEMON', 'SYMTEC', 'AVON', 'A-ME', 'HOPKINS', 'FULTON', 'WESBAR', 'PLANO', 'SURE LOAD',
  'HOT RODS', 'CYLINDER WORKS', 'SPEEDWERX', 'VE', 'HARTMAN', 'TIMBERSLED', 'NTN', 'EMERSON', 'RACEWERX', 'FABCRAFT', 'BETTER BOARDS',
  'MOTO TECH', 'HOLESHOT', 'ATV TEK', 'AO COOLERS', 'HORNET', 'FUELPAX', 'ROTOPAX', 'DSG', 'GMAX', 'SLEDNECKS', 'FROGG TOGGS',
  'DRAYKO', 'VENTURE', 'THERMACELL', 'SPIDI', 'TURTLE FUR', 'GAERNE', 'OGIO', 'YUASA', 'PBI', 'SCOTT', 'HABER', 'QUICK STRAP',
  'LIQUID IMAGE', 'BOMBER', 'DRAW-TITE', 'REESE', 'ITP', 'PRO SERIES', 'SUPERCLAMP', 'TKI', 'RYDE FX', 'FOX', 'CIPA', 'BLENDZALL',
  'JT', 'HIFLOFILTRO', 'ARC', 'HAMMERHEAD', 'NOCO GENIUS', 'BATTERY TENDER', 'TECMATE', 'PEET', 'IMS', 'SLIPSTREAMER', 'BUSS',
  'RAPTOR', 'DR.D', 'XENA', 'MAIER', 'PIVOT PEGZ', 'PUIG', 'NATIONAL CYCLE', 'TC BROS', 'CRUZ TOOLS', 'FIXT', 'PARK TOOL',
  'RK EXCEL', 'GRUNGE BRUSH', 'KNOBBYKNIFE', 'PJ1', 'SCHWALBE', 'PEDROS', 'STAR BRITE', 'KLUBER', 'FITCH', 'K100', 'BAUER',
  'SMITHTOOL', 'WIZARDS', 'RED LINE', 'MASTER LOCK', 'METRO VAC', 'AWC', 'DEAD BOLT', 'KRYPTONITE', 'GRAB ON', 'ERNST', 'SEDONA',
  'RACELINE', 'DWT', 'HIPER', 'GBC', 'BOYESEN', 'LUCAS', 'BIKE SPIRITS', 'TIROX', 'SPEEDO TUNER', 'PROFI', 'LUSTER LACE',
  'BLUE JOB', 'MOTOREX', 'PSR', 'CYCLE SPRINGS', 'PROK', 'SPIDER', 'MOTO TASSINARI', '2 COOL', 'CARLISLE', 'OURY', 'MECHANICS',
  'GASGACINCH', 'THREEBOND', 'PERMATEX', 'S100', 'DMP', 'DEVOL', 'PIAA', 'MOGO PARTS', 'TRAVELRITE', 'WARN', 'CYCLE COUNTRY',
  'ALL RITE', 'J&S', 'BANKS', 'WALLINGFORDS', 'FIMCO', 'ORTOVOX', 'AMK', 'DEUTER', 'FUEL TOOL', 'YANA SHIKI', 'KEITI',
  'COMP. WERKES', 'WILLIE & MAX', 'SEIZMIK', 'SSV WORKS', 'HIGH LIFTER', 'AQUA-HOT', 'IN-HOUSE', 'DUX', 'XPATV', 'BOSS AUDIO',
  'NORREC', 'ZETA', 'DRC', 'POLISPORT', 'NITERIDER', 'STOMPGRIP', 'BEARD', 'RIGID', 'SPEED', 'WORKS', 'JETT', 'EVS', 'POD',
  'TRAIL TECH', 'LIGHTSPEED', 'ALLSPORT', 'UNABIKER', 'ATHENA', 'P3', 'HOT CAMS', 'COMETIC', 'GATES', 'GASKET TECH.', 'GET',
  'JAMES GASKETS', 'ERLANDSON', 'NEWCOMB', 'EK', 'D.I.D', 'CRAMPBUSTER', 'SHOGUN', 'RAM', 'LEAD-DOG', 'SEER', 'F2P', 'CARDO',
  'ADAPTIV', 'EKLIPES', 'GO CRUISE', 'TWIN AIR', 'DRAGON', 'BULLDOG', 'KABUTO', 'WEST-EAGLE', 'ENERGY SUSP.', 'FMF', 'PRO FILTER',
  'MAC', 'HMF', 'DEI', 'PRO CIRCUIT', 'PROCLEAN', 'LIQUID PERFORMANCE', 'HOG WASH', 'BBR', 'PRO-WHEEL', 'BYKAS', 'PREC. BILLET',
  'FIGURE MACHINE', 'ALTO', 'ENERGY ONE', 'FEULING', 'ACCUTRONIX', 'NASH', 'MC BAGGERS', 'LYNDALL BRAKES', 'PRO PAD', 'GOODRIDGE',
  'UNI', 'FREEDOM', 'MOTUL', 'BLUE MARBLE', 'MOROSO', 'DUBYA', 'BAKER', 'JAGG', 'BUTTY BUDDY', 'KB PISTONS', 'ROOKE', 'FORBIDDEN',
  'ENGINE ICE', 'CASTROL', 'PIG SPIT', 'DANNY GRAY', 'WILD 1', 'GARDNERWESTCOTT', 'PAUGHCO', 'LINDBY', 'BEL-RAY', 'KLOTZ', 'SENA',
  'WILCOX', 'SLIME', 'TRU-FLATE', 'COUNTERACT', 'RIDE-ON', 'TIRE PENZ', 'PLEWS/EDELMANN', 'INNOVATIONS', 'ARNOTT', 'NOVELLO',
  'SDG INNOVATIONS', 'AIRHAWK', 'QUAD WORKS', 'CYCLE WORKS', 'D-COR', 'CYCLE PRO', 'EMD', 'DIAG4 BIKE', 'MICHELIN', 'PIRELLI',
  'SHINKO', 'TUBLISS', 'ARISUN', 'EXCESS', 'MAXXIS', 'VSI', 'DRIVEN', 'IRC', 'CST', 'KINGS', 'METZELER', 'TALON', 'TORCO',
  'SILKOLENE', 'NO TOIL', 'RACING 905', 'INSIGHT', 'RACE FACE', 'SINZ', 'TANGENT', 'PROMAX', 'ANARCHY', 'SPEEDLINE', 'YESS',
  'CRUPI', 'LDC', 'RENNEN', 'KINGSTAR', 'BLACK CROWN', 'PROFILE', 'ALIENATION', 'EXUSTAR', 'E13', 'SDG COMPONENTS', 'TBR',
  'J&M', 'SHOW CHROME (NEW)', 'AQUATIC AV', 'FIREBRAND-OLD', 'NEW-RAY', 'TOP SHELF', 'GARMIN', 'MASTER', 'VURB', 'L.A. SLEEVE',
  'MARSHALLS', 'N-STYLE', 'JUSTSAIL', 'REVARC', 'HYGEAR', 'GRANT', 'ALPINESTARS', 'REDI LITE', 'PHOENIX', 'ONE EMBLEMS',
  'HOTBODIES', 'CP', 'PRO ONE', 'QUANTUM', 'ROCKET PERFORMANCE GARAGE LLC', 'PERFORMANCE TOOL', 'BLU', 'OLD STF', 'COLONY MACHINE',
  'YOSHIMURA', 'RIVA', 'DRYGUY', 'SOCALMOTOGEAR', 'FLASH2PASS', 'UNIT', 'DURABLUE', 'SPIKE', 'RSI', 'CAT CRAP', 'TIER 1',
  'ROKSTRAPS', 'ZBROZ', 'NAVATLAS', 'COOL-N-LUBE', 'TEXA', 'CV4', 'TRU TENSION', 'UCLEAR', 'MISCELLANEOUS', 'SCORPION EXO',
  'EVANS', 'STKR', 'SCOSCHE', 'BRASS BALLS', 'GIANT LOOP', 'RACING BROTHERS', 'TTS', 'PRESTON PETTY', 'DRAGONFLY', 'TORCH IND.',
  'SUPERSPROX', 'HASTINGS MFG', 'FUNNELWEB', 'BLAC-RAC', 'ARROWHEAD', 'BAGGERNATION', 'JCRACING', 'FIRST ALERT', 'HT COMPONENTS',
  'GROTE', 'BIG BIKE PARTS', 'ANTIGRAVITY', 'BOONDOCKER', 'EXTREME TEAM', 'JW SPEAKER', 'DUPONT', 'LOCK AND LOAD', 'BFGOODRICH',
  'MOTOTRAX', 'NISSIN', 'MAGNAFLOW', 'PINGEL ENT', 'REKLUSE RACING', 'AIRPRO FORK', 'CALIFORNIA HEAT', 'EXTANG', 'CHASE',
  'SPORTSTUFF', 'PSYCHIC', 'CYRON', 'MALLORY', 'GREEN LIGHT TRIGGERS', 'SO EASY RIDER', 'IDEAL', 'DEVIANT RACE PARTS', 'IBEXX',
  'USI SKIS', 'SPECTRO', 'DIRT TRICKS', 'SAWICKI', 'GOLAN', 'DUNLOP', 'RALE INDUSTRIES', 'J STRONG', 'APM', 'COMPUFIRE', 'SPYKE',
  'MOTOZORB', 'DIAMOND CHAIN', 'GBrakes', 'XK GLOW', 'ULTRAGARD', 'DIAMOND LED', 'ROCKER LOCKERS', 'HOPPE', 'SADDLE TRAMP',
  'BLASTER', 'VP RACING', 'KENDA', 'SSI', 'KIDDE', 'USWE', 'WELD WHEELS', 'ENDURO ENGINEERING', 'NOMADIC', 'LECTRONS LLC',
  'KENS FACTORY', 'NAMZ CUSTOM CYCLE', 'RUSTY BUTCHER', 'DK CUSTOM PRODUCTS', 'KODLIN USA', 'HARDSTREET', 'ONGUARD', 'FMF APPAREL',
  'OXBOW GEAR LLC', 'FMF VISION', 'RIVAL POWERSPORTS USA', 'E-LINE ACCESSORIES', 'MAVERICK FISH HUNTER', 'MUC-OFF', 'FLAT OUT',
  'HIGHSIDER', 'XTC POWER PRODUCTS', 'XTRA SEAL', 'GLUE TREAD', 'KRUZER KADDY', 'FIREBRAND', 'EAGLE GRIT', 'HOPNEL', 'MOTO POCKETS',
  'ECOXGEAR', 'LETRIC LIGHTING CO', 'TAMER', 'CTEK', 'GLOVETACTS', 'SP CONNECT', 'JET PILOT', 'POWERBUILT', 'SANTORO FABWORX',
  'FACTOR 55', 'TIGER LIGHTS', 'STOP & GO', 'IGRIP', 'MAMMUT', 'ELEMENT FIRE', 'BUBBA ROPES', 'JRI SHOCKS', 'S&S OFFROAD',
  'HOFMANN DESIGNS', '100-PERCENT', 'CUSTOMACCES', 'CUSTOM ENGRAVING', 'BURLY BRAND', 'HAWG HALTERS INC', 'ABUS', 'RED BULL',
  'REMA TIP TOP', 'DFG', 'RIZOMA', 'SHIN YO', 'PARTS COMPANY INC', 'ULTRACOOL', 'NEW RAGE CYCLES', 'SYSTEM 3', 'RST',
  'LEN PERFORMANCE', 'CURT', 'DOMINO RACING', 'RKA', 'COBRA', 'WILD ASS', 'CERWIN VEGA', 'DIAMOND AUDIO', 'DBK', 'RM STATOR',
  'MOTOBATT', 'ARMOR VISION'
]

// All available item types from documentation
const ALL_ITEM_TYPES = [
  'Suspension', 'Hardware/Fasteners/Fittings', 'Promotional', 'Tire/Wheel Accessories', 'Drive', 'Intake/Carb/Fuel System',
  'Graphics/Decals', 'Exhaust', 'Stands/Lifts', 'Mats/Rugs', 'Straps/Tie-Downs', 'Accessories', 'Grips', 'Gloves', 'Tools',
  'Chemicals', 'Utility Containers', 'Fuel Containers', 'Eyewear', 'Sprockets', 'Winch', 'Mounts/Brackets', 'Trailer/Towing',
  'Body', 'Windshield/Windscreen', 'Electrical', 'Engine', 'Protective/Safety', 'Wheels', 'Skis/Carbides/Runners', 'Plow',
  'Plow Mount', 'Piston kits & Components', 'Track Kit', 'Footwear', 'Hyfax', 'Illumination', 'Clutch', 'Air Filters', 'Jets',
  'Gaskets/Seals', 'Clamps', 'Mirrors', 'Oil Filters', 'Gas Caps', 'Foot Controls', 'Levers', 'Cable/Hydraulic Control Lines',
  'Starters', 'Throttle', 'Audio/Visual/Communication', 'Switches', 'Onesies', 'Guards/Braces', 'Handguards', 'Engine Management',
  'Spark Plugs', 'Brakes', 'Risers', 'Ice Scratchers', 'Headgear', 'Shirts', 'Steering', 'Tracks', 'Handlebars', 'Seat',
  'Luggage', 'Watercraft Towables', 'Hand Controls', 'Belts', 'Fuel Tank', 'Flotation Vests', 'Racks', 'Helmet Accessories',
  'Layers', 'Vests', 'Storage Covers', 'Socks', 'Gauges/Meters', 'Security', 'Suits', 'Wheel Components', 'Replacement Parts',
  'Shorts', 'Hoodies', 'Jackets', 'Jerseys', 'Pants', 'Chains', 'UTV Cab/Roof/Door', 'Helmets', 'Batteries', 'Tires', 'Tubes',
  'Farm/Agriculture', 'Rims', 'Bicycle Frames', 'Cranks', 'Tank Tops', 'Bike', 'Sweaters', 'GPS', 'Videos', 'Shoes',
  'Tire And Wheel Kit', 'Undergarments', 'Forks', 'Food & Beverage', 'Winch Mount'
]

const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Name A-Z' },
  { value: 'name_desc', label: 'Name Z-A' },
  { value: 'newest', label: 'Newest First' },
  { value: 'created_asc', label: 'Oldest First' },
]

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<WPSItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('name_asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<'name' | 'sku'>('name')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedItemTypes, setSelectedItemTypes] = useState<string[]>([])
  const [showInStockOnly, setShowInStockOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const itemsPerPage = 20 // Changed to multiple of 4 (4x5)
  const { addItem } = useCartStore()

  // Fetch initial products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/products?page=${itemsPerPage}`)
        const data = await response.json()

        if (data.success && data.data) {
          // Extract items from products
          const allItems: WPSItem[] = []
          data.data.forEach((product: any) => {
            if (product.items && product.items.data) {
              allItems.push(...product.items.data)
            }
          })
          setAllProducts(allItems)
          
          // Set cursor for pagination
          if (data.meta?.cursor?.next) {
            setNextCursor(data.meta.cursor.next)
            setHasMore(true)
          } else {
            setHasMore(false)
          }
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Load more products with cursor pagination
  const loadMoreProducts = async () => {
    if (!nextCursor || loadingMore) return
    
    setLoadingMore(true)
    try {
      const response = await fetch(`/api/products?page=${itemsPerPage}&cursor=${nextCursor}`)
      const data = await response.json()

      if (data.success && data.data) {
        // Extract items from products
        const newItems: WPSItem[] = []
        data.data.forEach((product: any) => {
          if (product.items && product.items.data) {
            newItems.push(...product.items.data)
          }
        })
        
        // Append new items to existing products
        setAllProducts(prev => [...prev, ...newItems])
        
        // Update cursor for next page
        if (data.meta?.cursor?.next) {
          setNextCursor(data.meta.cursor.next)
        } else {
          setHasMore(false)
        }
      }
    } catch (error) {
      console.error('Failed to load more products:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Client-side filtering and sorting
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...allProducts]

    // Search filter
    if (searchTerm.length >= 3) {
      filtered = filtered.filter(product => {
        if (searchType === 'sku') {
          return product.sku.toLowerCase().includes(searchTerm.toLowerCase())
        } else {
          return product.name.toLowerCase().includes(searchTerm.toLowerCase())
        }
      })
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => 
        product.brand?.data?.name && selectedBrands.includes(product.brand.data.name)
      )
    }

    // Item type filter
    if (selectedItemTypes.length > 0) {
      filtered = filtered.filter(product => 
        product.product_type && selectedItemTypes.includes(product.product_type)
      )
    }

    // Stock filter
    if (showInStockOnly) {
      filtered = filtered.filter(product => product.status === 'STK')
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name_asc':
          return a.name.localeCompare(b.name)
        case 'name_desc':
          return b.name.localeCompare(a.name)
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'created_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [allProducts, searchTerm, searchType, selectedBrands, selectedItemTypes, showInStockOnly, sortBy])

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numPrice)
  }

  const getProductImage = (product: WPSItem) => {
    if (ImageUtils.hasImages(product)) {
      return ImageUtils.getOptimizedImageUrl(product, 'card', '/placeholder-product.svg')
    }
    return '/placeholder-product.svg'
  }

  const handleAddToCart = (product: WPSItem) => {
    addItem(product, 1)
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedBrands([])
    setSelectedItemTypes([])
    setShowInStockOnly(false)
  }

  const activeFiltersCount = [
    searchTerm.length >= 3,
    selectedBrands.length > 0,
    selectedItemTypes.length > 0,
    showInStockOnly
  ].filter(Boolean).length

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
  }

  const handleItemTypeChange = (itemType: string) => {
    setSelectedItemTypes(prev => 
      prev.includes(itemType) 
        ? prev.filter(t => t !== itemType)
        : [...prev, itemType]
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-steel-200 rounded w-64 mb-6" />
            <div className="h-16 bg-steel-200 rounded w-full mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="h-80 bg-steel-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-steel-900 mb-4">
            All Products
          </h1>
          <p className="text-xl text-steel-600 mb-8">
            Browse our complete selection of motorcycle parts and accessories.
          </p>

          {/* Enhanced Search Bar */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Main Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-steel-400 h-6 w-6" />
                  <input
                    type="text"
                    placeholder={`Search by ${searchType === 'name' ? 'product name' : 'SKU'}... (minimum 3 characters)`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 text-lg border-2 border-steel-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-steel-400 hover:text-steel-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
                {searchTerm.length > 0 && searchTerm.length < 3 && (
                  <div className="mt-2 text-sm text-steel-500">
                    Type {3 - searchTerm.length} more character{3 - searchTerm.length !== 1 ? 's' : ''} to search
                  </div>
                )}
              </div>

              {/* Search Type Toggle */}
              <div className="flex bg-steel-100 rounded-lg p-1">
                <button
                  onClick={() => setSearchType('name')}
                  className={`px-4 py-2 rounded-md font-medium transition-all ${
                    searchType === 'name' 
                      ? 'bg-white text-primary-600 shadow-sm' 
                      : 'text-steel-600 hover:text-steel-900'
                  }`}
                >
                  By Name
                </button>
                <button
                  onClick={() => setSearchType('sku')}
                  className={`px-4 py-2 rounded-md font-medium transition-all ${
                    searchType === 'sku' 
                      ? 'bg-white text-primary-600 shadow-sm' 
                      : 'text-steel-600 hover:text-steel-900'
                  }`}
                >
                  By SKU
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn btn-outline flex items-center gap-2 min-w-[120px] ${
                  showFilters ? 'bg-primary-50 border-primary-300' : ''
                }`}
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filter Bars */}
          {showFilters && (
            <div className="bg-steel-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-steel-900">Filter Products</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Brand Filter Bar */}
                <div>
                  <label className="block text-sm font-medium text-steel-700 mb-3">
                    Brands ({selectedBrands.length} selected)
                  </label>
                  <div className="bg-white rounded-lg border border-steel-200 max-h-40 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 p-2">
                      {ALL_BRANDS.map(brand => (
                        <label key={brand} className="flex items-center space-x-2 p-2 hover:bg-steel-50 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandChange(brand)}
                            className="form-checkbox text-primary-600 rounded"
                          />
                          <span className="text-sm text-steel-700 truncate">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Item Type Filter Bar */}
                <div>
                  <label className="block text-sm font-medium text-steel-700 mb-3">
                    Item Types ({selectedItemTypes.length} selected)
                  </label>
                  <div className="bg-white rounded-lg border border-steel-200 max-h-40 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 p-2">
                      {ALL_ITEM_TYPES.map(itemType => (
                        <label key={itemType} className="flex items-center space-x-2 p-2 hover:bg-steel-50 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedItemTypes.includes(itemType)}
                            onChange={() => handleItemTypeChange(itemType)}
                            className="form-checkbox text-primary-600 rounded"
                          />
                          <span className="text-sm text-steel-700 truncate">{itemType}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Filters */}
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showInStockOnly}
                      onChange={(e) => setShowInStockOnly(e.target.checked)}
                      className="form-checkbox text-primary-600 rounded"
                    />
                    <span className="text-sm font-medium text-steel-700">In Stock Only</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6">
            {/* Results Count */}
            <div className="flex items-center gap-4">
              <p className="text-steel-600">
                {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'} found
                {searchTerm.length >= 3 && ` for "${searchTerm}"`}
              </p>
              {hasMore && (
                <p className="text-steel-500 text-sm">
                  More products available - scroll down to load more
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-input min-w-[200px]"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-steel-600 hover:text-steel-900'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
                    viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-steel-600 hover:text-steel-900'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Tags */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {searchTerm.length >= 3 && (
                <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm('')} className="hover:bg-primary-200 rounded-full p-1">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedBrands.map(brand => (
                <span key={brand} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Brand: {brand}
                  <button onClick={() => handleBrandChange(brand)} className="hover:bg-blue-200 rounded-full p-1">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {selectedItemTypes.map(itemType => (
                <span key={itemType} className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Type: {itemType}
                  <button onClick={() => handleItemTypeChange(itemType)} className="hover:bg-green-200 rounded-full p-1">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {showInStockOnly && (
                <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  In Stock Only
                  <button onClick={() => setShowInStockOnly(false)} className="hover:bg-yellow-200 rounded-full p-1">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredAndSortedProducts.map((product) => (
              <div
                key={product.id}
                className={`group bg-white border border-steel-200 rounded-lg overflow-hidden hover:shadow-card-hover transition-all duration-300 ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Product Image */}
                <div className={`relative bg-steel-50 overflow-hidden ${
                  viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'
                }`}>
                  {ImageUtils.hasImages(product) ? (
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-product.svg'
                      }}
                    />
                  ) : (
                    <ImagePlaceholder 
                      message="Image coming soon"
                      className="w-full h-full"
                    />
                  )}
                  <Link
                    href={`/product/${product.product_id}`}
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  {/* Brand */}
                  {product.brand?.data && (
                    <p className="text-xs text-steel-500 uppercase tracking-wide mb-1">
                      {product.brand.data.name}
                    </p>
                  )}

                  {/* Product Name */}
                  <h3 className={`font-medium text-steel-900 mb-2 ${
                    viewMode === 'list' ? 'text-lg' : 'text-sm line-clamp-2 h-10'
                  }`}>
                    <Link
                      href={`/product/${product.product_id}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {product.name}
                    </Link>
                  </h3>

                  {/* Product Type */}
                  {product.product_type && (
                    <p className="text-xs text-steel-500 mb-2">
                      {product.product_type}
                    </p>
                  )}

                  {/* Price and SKU */}
                  <div className={`flex items-center justify-between mb-3 ${
                    viewMode === 'list' ? 'flex-col items-start' : ''
                  }`}>
                    <div>
                      <span className={`font-bold text-primary-600 ${
                        viewMode === 'list' ? 'text-xl' : 'text-lg'
                      }`}>
                        {formatPrice(product.list_price)}
                      </span>
                      {product.mapp_price && parseFloat(product.mapp_price) > 0 && (
                        <span className="text-sm text-steel-400 line-through ml-2">
                          {formatPrice(product.mapp_price)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* SKU */}
                  <p className="text-xs text-steel-400 mb-3">
                    SKU: {product.sku}
                  </p>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`btn btn-primary ${
                      viewMode === 'list' ? 'btn-lg' : 'btn-sm w-full'
                    }`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-steel-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-steel-900 mb-2">
              No products found
            </h3>
            <p className="text-steel-600 mb-6">
              Try adjusting your search terms or filters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={clearAllFilters}
                className="btn btn-outline"
              >
                Clear All Filters
              </button>
              <Link href="/categories" className="btn btn-primary">
                Browse Categories
              </Link>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && filteredAndSortedProducts.length > 0 && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMoreProducts}
              disabled={loadingMore}
              className="btn btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Loading More...
                </>
              ) : (
                'Load More Products'
              )}
            </button>
          </div>
        )}

      </div>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}