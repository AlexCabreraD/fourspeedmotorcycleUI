'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
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
  const searchParams = useSearchParams()
  const [allProducts, setAllProducts] = useState<WPSItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadingFilters, setLoadingFilters] = useState(false)
  const [searching, setSearching] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('name_asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<'name' | 'sku'>('name')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedItemTypes, setSelectedItemTypes] = useState<string[]>([])
  const [showInStockOnly, setShowInStockOnly] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [searchResults, setSearchResults] = useState<WPSItem[]>([])
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [brandSearchTerm, setBrandSearchTerm] = useState('')
  const [itemTypeSearchTerm, setItemTypeSearchTerm] = useState('')
  
  // New filter states
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [newArrivalsFilter, setNewArrivalsFilter] = useState('')
  const [recentlyUpdatedFilter, setRecentlyUpdatedFilter] = useState('')
  const [weightRange, setWeightRange] = useState({ min: '', max: '' })
  const [dimensionFilters, setDimensionFilters] = useState({
    length: { min: '', max: '' },
    width: { min: '', max: '' },
    height: { min: '', max: '' }
  })
  
  const itemsPerPage = 20 // Changed to multiple of 4 (4x5)
  const { addItem } = useCartStore()
  
  // Search cache and debounce
  const searchCache = useRef<Map<string, WPSItem[]>>(new Map())
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const currentSearchRef = useRef<string>('')
  
  // Filter results cache
  const filterCache = useRef<Map<string, {
    products: WPSItem[]
    nextCursor: string | null
    hasMore: boolean
    timestamp: number
  }>>(new Map())
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  // Build filter query parameters
  const buildFilterParams = useCallback(() => {
    const params = new URLSearchParams()
    
    // Always include page size
    params.set('page', itemsPerPage.toString())
    
    // Add filters
    if (selectedBrands.length > 0) {
      params.set('brands', selectedBrands.join(','))
    }
    
    if (selectedItemTypes.length > 0) {
      params.set('item_types', selectedItemTypes.join(','))
    }
    
    if (showInStockOnly) {
      params.set('in_stock', 'true')
    }
    
    // Price range filters
    if (priceRange.min) {
      params.set('min_price', priceRange.min)
    }
    if (priceRange.max) {
      params.set('max_price', priceRange.max)
    }
    
    // Date filters
    if (newArrivalsFilter) {
      params.set('new_arrivals_days', newArrivalsFilter)
    }
    if (recentlyUpdatedFilter) {
      params.set('recently_updated_days', recentlyUpdatedFilter)
    }
    
    // Weight range filters
    if (weightRange.min) {
      params.set('min_weight', weightRange.min)
    }
    if (weightRange.max) {
      params.set('max_weight', weightRange.max)
    }
    
    // Dimension filters
    if (dimensionFilters.length.min) params.set('min_length', dimensionFilters.length.min)
    if (dimensionFilters.length.max) params.set('max_length', dimensionFilters.length.max)
    if (dimensionFilters.width.min) params.set('min_width', dimensionFilters.width.min)
    if (dimensionFilters.width.max) params.set('max_width', dimensionFilters.width.max)
    if (dimensionFilters.height.min) params.set('min_height', dimensionFilters.height.min)
    if (dimensionFilters.height.max) params.set('max_height', dimensionFilters.height.max)
    
    // Add sorting
    if (sortBy && sortBy !== 'name_asc') {
      params.set('sort', sortBy)
    }
    
    return params.toString()
  }, [selectedBrands, selectedItemTypes, showInStockOnly, sortBy, itemsPerPage])

  // Create cache key for filter combination
  const createCacheKey = useCallback((cursor?: string) => {
    const filterParams = buildFilterParams()
    return cursor ? `${filterParams}&cursor=${cursor}` : filterParams
  }, [buildFilterParams])

  // Check if cache entry is still valid
  const isCacheValid = useCallback((timestamp: number) => {
    return Date.now() - timestamp < CACHE_DURATION
  }, [])

  // Fetch products with current filters
  const fetchProducts = useCallback(async (cursor?: string, reset: boolean = false) => {
    const isInitialLoad = !cursor
    const cacheKey = createCacheKey(cursor)
    
    // Check cache first
    const cachedResult = filterCache.current.get(cacheKey)
    if (cachedResult && isCacheValid(cachedResult.timestamp)) {
      console.log('📦 Using cached result for:', cacheKey)
      
      if (reset || isInitialLoad) {
        setAllProducts(cachedResult.products)
      } else {
        setAllProducts(prev => [...prev, ...cachedResult.products])
      }
      
      setNextCursor(cachedResult.nextCursor)
      setHasMore(cachedResult.hasMore)
      return
    }
    
    // Set loading states
    if (isInitialLoad && !loadingFilters) setLoading(true)
    else if (!isInitialLoad) setLoadingMore(true)
    
    try {
      console.log('🌐 Making API call for:', cacheKey)
      const filterParams = buildFilterParams()
      const cursorParam = cursor ? `&cursor=${cursor}` : ''
      const response = await fetch(`/api/products?${filterParams}${cursorParam}`)
      const data = await response.json()

      if (data.success && data.data) {
        // Extract items from products
        const newItems: WPSItem[] = []
        data.data.forEach((product: any) => {
          if (product.items && product.items.data) {
            newItems.push(...product.items.data)
          }
        })
        
        const nextCursor = data.meta?.cursor?.next || null
        const hasMore = !!nextCursor
        
        // Cache the result
        filterCache.current.set(cacheKey, {
          products: newItems,
          nextCursor,
          hasMore,
          timestamp: Date.now()
        })
        
        if (reset || isInitialLoad) {
          setAllProducts(newItems)
        } else {
          setAllProducts(prev => [...prev, ...newItems])
        }
        
        setNextCursor(nextCursor)
        setHasMore(hasMore)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      if (isInitialLoad && !loadingFilters) setLoading(false)
      if (!isInitialLoad) setLoadingMore(false)
    }
  }, [buildFilterParams, loadingFilters, createCacheKey, isCacheValid])

  // Initialize search term from URL parameter
  useEffect(() => {
    const urlSearchTerm = searchParams.get('search')
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm)
    }
  }, [searchParams])

  // Fetch initial products on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  // Refetch when filters change
  useEffect(() => {
    // Skip initial load
    if (loading) return
    
    // Set loading state for filters specifically
    setLoadingFilters(true)
    
    // Reset and fetch with new filters
    fetchProducts(undefined, true).finally(() => {
      setLoadingFilters(false)
    })
  }, [selectedBrands, selectedItemTypes, showInStockOnly, sortBy, priceRange, newArrivalsFilter, recentlyUpdatedFilter, weightRange, dimensionFilters])

  // Clean up expired cache entries periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now()
      for (const [key, value] of filterCache.current.entries()) {
        if (!isCacheValid(value.timestamp)) {
          filterCache.current.delete(key)
        }
      }
    }, 60000) // Clean up every minute
    
    return () => clearInterval(cleanupInterval)
  }, [isCacheValid])

  // Search function with caching
  const performSearch = useCallback(async (query: string, type: 'name' | 'sku') => {
    const cacheKey = `${type}:${query.toLowerCase()}`
    
    // Check cache first
    if (searchCache.current.has(cacheKey)) {
      const cachedResults = searchCache.current.get(cacheKey)!
      setSearchResults(cachedResults)
      setIsSearchActive(true)
      return
    }
    
    setSearching(true)
    try {
      const searchParam = type === 'name' ? 'search' : 'sku'
      const response = await fetch(`/api/products?page=50&${searchParam}=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (data.success && data.data) {
        // Extract items from products
        const searchItems: WPSItem[] = []
        data.data.forEach((product: any) => {
          if (product.items && product.items.data) {
            searchItems.push(...product.items.data)
          }
        })
        
        // Cache the results
        searchCache.current.set(cacheKey, searchItems)
        
        // Only update if this is still the current search
        if (currentSearchRef.current === query) {
          setSearchResults(searchItems)
          setIsSearchActive(true)
        }
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setSearching(false)
    }
  }, [])

  // Debounced search effect
  useEffect(() => {
    if (searchTerm.length >= 3) {
      currentSearchRef.current = searchTerm
      
      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
      
      // Set new timeout for debounced search
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(searchTerm, searchType)
      }, 300) // 300ms debounce
    } else {
      // Clear search when less than 3 characters
      setIsSearchActive(false)
      setSearchResults([])
      currentSearchRef.current = ''
    }
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchTerm, searchType, performSearch])

  // Load more products with current filters
  const loadMoreProducts = useCallback(async () => {
    if (!nextCursor || loadingMore || isSearchActive) return
    
    await fetchProducts(nextCursor, false)
  }, [nextCursor, loadingMore, isSearchActive, fetchProducts])

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

  // Get the appropriate product list based on search state
  const displayProducts = useMemo(() => {
    if (isSearchActive) {
      // For search results, still apply client-side filtering since search is separate
      let filtered = [...searchResults]

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

      // Sorting for search results
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
    }
    
    // For regular browsing, products are already filtered and sorted by server
    return allProducts
  }, [isSearchActive, searchResults, allProducts, selectedBrands, selectedItemTypes, showInStockOnly, sortBy])

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
    setShowInStockOnly(true) // Reset to default (true)
    setIsSearchActive(false)
    setSearchResults([])
    setBrandSearchTerm('')
    setItemTypeSearchTerm('')
    setPriceRange({ min: '', max: '' })
    setNewArrivalsFilter('')
    setRecentlyUpdatedFilter('')
    setWeightRange({ min: '', max: '' })
    setDimensionFilters({
      length: { min: '', max: '' },
      width: { min: '', max: '' },
      height: { min: '', max: '' }
    })
    currentSearchRef.current = ''
    
    // Clear filter cache when resetting filters
    filterCache.current.clear()
  }

  const activeFiltersCount = [
    isSearchActive,
    selectedBrands.length > 0,
    selectedItemTypes.length > 0,
    showInStockOnly,
    priceRange.min || priceRange.max,
    newArrivalsFilter,
    recentlyUpdatedFilter,
    weightRange.min || weightRange.max,
    dimensionFilters.length.min || dimensionFilters.length.max ||
    dimensionFilters.width.min || dimensionFilters.width.max ||
    dimensionFilters.height.min || dimensionFilters.height.max
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

  // Filter brands based on search
  const filteredBrands = useMemo(() => {
    if (!brandSearchTerm) return ALL_BRANDS
    return ALL_BRANDS.filter(brand => 
      brand.toLowerCase().includes(brandSearchTerm.toLowerCase())
    )
  }, [brandSearchTerm])

  // Filter item types based on search
  const filteredItemTypes = useMemo(() => {
    if (!itemTypeSearchTerm) return ALL_ITEM_TYPES
    return ALL_ITEM_TYPES.filter(itemType => 
      itemType.toLowerCase().includes(itemTypeSearchTerm.toLowerCase())
    )
  }, [itemTypeSearchTerm])

  // Only show full skeleton on true initial load (when we have no products at all)
  if (loading && allProducts.length === 0 && !loadingFilters) {
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
            {/* Main controls row - consistent height */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch">
              {/* Main Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-steel-400 h-6 w-6" />
                  <input
                    type="text"
                    placeholder={`Search by ${searchType === 'name' ? 'product name' : 'SKU'}... (minimum 3 characters)`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 text-lg border-2 border-steel-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all h-[60px]"
                  />
                  {searching && (
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500" />
                    </div>
                  )}
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-steel-400 hover:text-steel-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Search Type Toggle */}
              <div className="flex bg-steel-100 rounded-lg p-2 h-[60px] items-center">
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

              {/* In Stock Toggle - Prominent */}
              <button
                onClick={() => setShowInStockOnly(!showInStockOnly)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all border-2 min-w-[140px] h-[60px] ${
                  showInStockOnly 
                    ? 'bg-green-50 border-green-300 text-green-700 shadow-sm' 
                    : 'bg-white border-steel-300 text-steel-600 hover:border-green-300 hover:text-green-600'
                }`}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                  showInStockOnly 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-steel-400'
                }`}>
                  {showInStockOnly && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                In Stock Only
              </button>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn btn-outline flex items-center gap-2 min-w-[120px] h-[60px] ${
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

            {/* Helper text row - appears below all controls */}
            <div className="mt-3">
              {searchTerm.length > 0 && searchTerm.length < 3 && (
                <div className="text-sm text-steel-500">
                  Type {3 - searchTerm.length} more character{3 - searchTerm.length !== 1 ? 's' : ''} to search
                </div>
              )}
              {searching && (
                <div className="text-sm text-primary-600">
                  Searching...
                </div>
              )}
              {isSearchActive && searchResults.length > 0 && (
                <div className="text-sm text-green-600">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchTerm}"
                </div>
              )}
              {isSearchActive && searchResults.length === 0 && !searching && (
                <div className="text-sm text-steel-500">
                  No results found for "{searchTerm}"
                </div>
              )}
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
                  <div className="bg-white rounded-lg border border-steel-200">
                    {/* Brand Search Bar */}
                    <div className="p-3 border-b border-steel-200">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Search brands..."
                          value={brandSearchTerm}
                          onChange={(e) => setBrandSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 text-sm border border-steel-300 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-200"
                        />
                        {brandSearchTerm && (
                          <button
                            onClick={() => setBrandSearchTerm('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-steel-400 hover:text-steel-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Brand List */}
                    <div className="max-h-40 overflow-y-auto">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 p-2">
                        {filteredBrands.map(brand => (
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
                      {filteredBrands.length === 0 && (
                        <div className="text-center py-4 text-steel-500 text-sm">
                          No brands found matching "{brandSearchTerm}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Item Type Filter Bar */}
                <div>
                  <label className="block text-sm font-medium text-steel-700 mb-3">
                    Item Types ({selectedItemTypes.length} selected)
                  </label>
                  <div className="bg-white rounded-lg border border-steel-200">
                    {/* Item Type Search Bar */}
                    <div className="p-3 border-b border-steel-200">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Search item types..."
                          value={itemTypeSearchTerm}
                          onChange={(e) => setItemTypeSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 text-sm border border-steel-300 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-200"
                        />
                        {itemTypeSearchTerm && (
                          <button
                            onClick={() => setItemTypeSearchTerm('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-steel-400 hover:text-steel-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Item Type List */}
                    <div className="max-h-40 overflow-y-auto">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 p-2">
                        {filteredItemTypes.map(itemType => (
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
                      {filteredItemTypes.length === 0 && (
                        <div className="text-center py-4 text-steel-500 text-sm">
                          No item types found matching "{itemTypeSearchTerm}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-steel-700 mb-3">
                    Price Range (USD)
                  </label>
                  <div className="flex gap-3 items-center">
                    <div>
                      <label className="block text-xs text-steel-500 mb-1">Min</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        className="w-24 px-3 py-2 text-sm border border-steel-300 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-200"
                      />
                    </div>
                    <span className="text-steel-400 mt-5">to</span>
                    <div>
                      <label className="block text-xs text-steel-500 mb-1">Max</label>
                      <input
                        type="number"
                        placeholder="1000"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        className="w-24 px-3 py-2 text-sm border border-steel-300 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Date Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-steel-700 mb-3">
                      New Arrivals
                    </label>
                    <select
                      value={newArrivalsFilter}
                      onChange={(e) => setNewArrivalsFilter(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-steel-300 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-200"
                    >
                      <option value="">All items</option>
                      <option value="7">Last 7 days</option>
                      <option value="30">Last 30 days</option>
                      <option value="90">Last 3 months</option>
                      <option value="365">Last year</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-steel-700 mb-3">
                      Recently Updated
                    </label>
                    <select
                      value={recentlyUpdatedFilter}
                      onChange={(e) => setRecentlyUpdatedFilter(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-steel-300 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-200"
                    >
                      <option value="">All items</option>
                      <option value="7">Last 7 days</option>
                      <option value="30">Last 30 days</option>
                      <option value="90">Last 3 months</option>
                      <option value="365">Last year</option>
                    </select>
                  </div>
                </div>

                {/* Weight Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-steel-700 mb-3">
                    Weight Range (lbs)
                  </label>
                  <div className="flex gap-3 items-center">
                    <div>
                      <label className="block text-xs text-steel-500 mb-1">Min</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        value={weightRange.min}
                        onChange={(e) => setWeightRange(prev => ({ ...prev, min: e.target.value }))}
                        className="w-24 px-3 py-2 text-sm border border-steel-300 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-200"
                      />
                    </div>
                    <span className="text-steel-400 mt-5">to</span>
                    <div>
                      <label className="block text-xs text-steel-500 mb-1">Max</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="50"
                        value={weightRange.max}
                        onChange={(e) => setWeightRange(prev => ({ ...prev, max: e.target.value }))}
                        className="w-24 px-3 py-2 text-sm border border-steel-300 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Dimensions Filter */}
                <div>
                  <label className="block text-sm font-medium text-steel-700 mb-3">
                    Dimensions (inches)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Length */}
                    <div>
                      <label className="block text-xs text-steel-500 mb-2">Length</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Min"
                          value={dimensionFilters.length.min}
                          onChange={(e) => setDimensionFilters(prev => ({ 
                            ...prev, 
                            length: { ...prev.length, min: e.target.value }
                          }))}
                          className="w-20 px-2 py-1 text-xs border border-steel-300 rounded focus:border-primary-500"
                        />
                        <span className="text-xs text-steel-400">-</span>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Max"
                          value={dimensionFilters.length.max}
                          onChange={(e) => setDimensionFilters(prev => ({ 
                            ...prev, 
                            length: { ...prev.length, max: e.target.value }
                          }))}
                          className="w-20 px-2 py-1 text-xs border border-steel-300 rounded focus:border-primary-500"
                        />
                      </div>
                    </div>

                    {/* Width */}
                    <div>
                      <label className="block text-xs text-steel-500 mb-2">Width</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Min"
                          value={dimensionFilters.width.min}
                          onChange={(e) => setDimensionFilters(prev => ({ 
                            ...prev, 
                            width: { ...prev.width, min: e.target.value }
                          }))}
                          className="w-20 px-2 py-1 text-xs border border-steel-300 rounded focus:border-primary-500"
                        />
                        <span className="text-xs text-steel-400">-</span>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Max"
                          value={dimensionFilters.width.max}
                          onChange={(e) => setDimensionFilters(prev => ({ 
                            ...prev, 
                            width: { ...prev.width, max: e.target.value }
                          }))}
                          className="w-20 px-2 py-1 text-xs border border-steel-300 rounded focus:border-primary-500"
                        />
                      </div>
                    </div>

                    {/* Height */}
                    <div>
                      <label className="block text-xs text-steel-500 mb-2">Height</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Min"
                          value={dimensionFilters.height.min}
                          onChange={(e) => setDimensionFilters(prev => ({ 
                            ...prev, 
                            height: { ...prev.height, min: e.target.value }
                          }))}
                          className="w-20 px-2 py-1 text-xs border border-steel-300 rounded focus:border-primary-500"
                        />
                        <span className="text-xs text-steel-400">-</span>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Max"
                          value={dimensionFilters.height.max}
                          onChange={(e) => setDimensionFilters(prev => ({ 
                            ...prev, 
                            height: { ...prev.height, max: e.target.value }
                          }))}
                          className="w-20 px-2 py-1 text-xs border border-steel-300 rounded focus:border-primary-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6">
            {/* Results Count */}
            <div className="flex items-center gap-4">
              {loadingFilters ? (
                <div className="flex items-center gap-2 text-steel-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600" />
                  <span>Updating results...</span>
                </div>
              ) : (
                <p className="text-steel-600">
                  {displayProducts.length} result{displayProducts.length === 1 ? '' : 's'}
                  {isSearchActive ? ` for "${searchTerm}"` : ''}
                </p>
              )}
              {hasMore && !isSearchActive && (
                <p className="text-steel-500 text-sm">
                  Load more to see additional results
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
              {isSearchActive && (
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
              {(priceRange.min || priceRange.max) && (
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  Price: ${priceRange.min || '0'} - ${priceRange.max || '∞'}
                  <button onClick={() => setPriceRange({ min: '', max: '' })} className="hover:bg-purple-200 rounded-full p-1">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {newArrivalsFilter && (
                <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                  New: Last {newArrivalsFilter} days
                  <button onClick={() => setNewArrivalsFilter('')} className="hover:bg-indigo-200 rounded-full p-1">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {recentlyUpdatedFilter && (
                <span className="inline-flex items-center gap-1 bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">
                  Updated: Last {recentlyUpdatedFilter} days
                  <button onClick={() => setRecentlyUpdatedFilter('')} className="hover:bg-cyan-200 rounded-full p-1">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {(weightRange.min || weightRange.max) && (
                <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                  Weight: {weightRange.min || '0'} - {weightRange.max || '∞'} lbs
                  <button onClick={() => setWeightRange({ min: '', max: '' })} className="hover:bg-orange-200 rounded-full p-1">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {(dimensionFilters.length.min || dimensionFilters.length.max || 
                dimensionFilters.width.min || dimensionFilters.width.max ||
                dimensionFilters.height.min || dimensionFilters.height.max) && (
                <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                  Dimensions Applied
                  <button onClick={() => setDimensionFilters({
                    length: { min: '', max: '' },
                    width: { min: '', max: '' },
                    height: { min: '', max: '' }
                  })} className="hover:bg-teal-200 rounded-full p-1">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loadingFilters ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {[...Array(itemsPerPage)].map((_, i) => (
              <div
                key={i}
                className={`group bg-white border border-steel-200 rounded-lg overflow-hidden ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Product Image Skeleton */}
                <div className={`relative bg-steel-50 overflow-hidden ${
                  viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'
                }`}>
                  <div className="w-full h-full bg-steel-200 animate-pulse" />
                </div>

                {/* Product Info Skeleton */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  {/* Brand */}
                  <div className="h-3 bg-steel-200 rounded w-16 mb-1 animate-pulse" />

                  {/* Product Name */}
                  <div className={`space-y-2 mb-2 ${
                    viewMode === 'list' ? '' : 'h-10'
                  }`}>
                    <div className="h-4 bg-steel-200 rounded animate-pulse" />
                    {viewMode === 'grid' && (
                      <div className="h-4 bg-steel-200 rounded w-3/4 animate-pulse" />
                    )}
                  </div>

                  {/* Product Type */}
                  <div className="h-3 bg-steel-200 rounded w-20 mb-2 animate-pulse" />

                  {/* Price */}
                  <div className={`flex items-center justify-between mb-3 ${
                    viewMode === 'list' ? 'flex-col items-start' : ''
                  }`}>
                    <div className="h-5 bg-steel-200 rounded w-16 animate-pulse" />
                  </div>

                  {/* SKU */}
                  <div className="h-3 bg-steel-200 rounded w-24 mb-3 animate-pulse" />

                  {/* Add to Cart Button */}
                  <div className={`h-10 bg-steel-200 rounded animate-pulse ${
                    viewMode === 'list' ? 'w-32' : 'w-full'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        ) : displayProducts.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {displayProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.product_id}`}
                className="block"
              >
                <div
                  className={`group bg-white border border-steel-200 rounded-lg overflow-hidden hover:shadow-card-hover transition-all duration-300 cursor-pointer ${
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
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
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
                  <h3 className={`font-medium text-steel-900 mb-2 hover:text-primary-600 transition-colors ${
                    viewMode === 'list' ? 'text-lg' : 'text-sm line-clamp-2 h-10'
                  }`}>
                    {product.name}
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
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleAddToCart(product)
                    }}
                    className={`btn btn-primary ${
                      viewMode === 'list' ? 'btn-lg' : 'btn-sm w-full'
                    }`}
                  >
                    Add to Cart
                  </button>
                </div>
                </div>
              </Link>
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

        {/* Load More Button - only show when not searching */}
        {hasMore && !isSearchActive && displayProducts.length > 0 && (
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

        {/* Results Summary */}
        <div className="mt-8 text-center text-steel-600">
          {isSearchActive ? (
            `${displayProducts.length} result${displayProducts.length === 1 ? '' : 's'} for "${searchTerm}"`
          ) : (
            `${displayProducts.length}${hasMore ? '+' : ''} result${displayProducts.length === 1 ? '' : 's'}`
          )}
        </div>

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