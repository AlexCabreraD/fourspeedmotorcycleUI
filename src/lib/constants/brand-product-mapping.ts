// Brand to product type mapping - prioritizes brands that are likely to make items for specific product types
export const BRAND_PRODUCT_TYPE_MAPPING: Record<string, string[]> = {
  // Engine brands
  'WISECO': ['Engine', 'Piston kits & Components', 'Gaskets/Seals'],
  'VERTEX': ['Engine', 'Piston kits & Components', 'Gaskets/Seals'],
  'NAMURA': ['Engine', 'Piston kits & Components', 'Gaskets/Seals'],
  'PROX': ['Engine', 'Piston kits & Components', 'Gaskets/Seals'],
  'HOT RODS': ['Engine', 'Piston kits & Components', 'Gaskets/Seals'],
  'CYLINDER WORKS': ['Engine', 'Piston kits & Components'],
  'WSM': ['Engine', 'Piston kits & Components', 'Gaskets/Seals'],
  'COMETIC': ['Engine', 'Gaskets/Seals'],
  'JAMES GASKETS': ['Engine', 'Gaskets/Seals'],
  'GASKET TECH.': ['Engine', 'Gaskets/Seals'],
  'ATHENA': ['Engine', 'Gaskets/Seals'],
  
  // Suspension brands
  'FOX': ['Suspension'],
  'KYB': ['Suspension'],
  'XTRIG': ['Suspension'],
  'RACE TECH': ['Suspension'],
  'PROGRESSIVE': ['Suspension'],
  'WORKS': ['Suspension'],
  'SHOCKPROS': ['Suspension'],
  'JRI SHOCKS': ['Suspension'],
  'ZBROZ': ['Suspension'],
  
  // Exhaust brands
  'FMF': ['Exhaust'],
  'YOSHIMURA': ['Exhaust'],
  'PRO CIRCUIT': ['Exhaust'],
  'HMF': ['Exhaust'],
  'MBRP': ['Exhaust'],
  'DR.D': ['Exhaust'],
  'MAC': ['Exhaust'],
  'TTS': ['Exhaust', 'Engine', 'Intake/Carb/Fuel System'],
  'BBR': ['Exhaust'],
  
  // Brakes brands
  'EBC': ['Brakes'],
  'GALFER': ['Brakes'],
  'BRAKING': ['Brakes'],
  'LYNDALL BRAKES': ['Brakes'],
  'NISSIN': ['Brakes'],
  'MAGURA': ['Brakes'],
  'GBrakes': ['Brakes'],
  
  // Wheels and Tires brands
  'ITP': ['Wheels', 'Tires', 'Wheel Components'],
  'DWT': ['Wheels', 'Wheel Components'],
  'HIPER': ['Wheels', 'Wheel Components'],
  'SEDONA': ['Wheels', 'Tires'],
  'RACELINE': ['Wheels', 'Wheel Components'],
  'MAXXIS': ['Tires'],
  'DUNLOP': ['Tires'],
  'MICHELIN': ['Tires'],
  'PIRELLI': ['Tires'],
  'SHINKO': ['Tires'],
  'METZELER': ['Tires'],
  'KENDA': ['Tires'],
  'CST': ['Tires'],
  'IRC': ['Tires'],
  'CARLISLE': ['Tires'],
  'SYSTEM 3': ['Wheels', 'Tires'],
  
  // Electrical brands
  'NGK': ['Electrical', 'Spark Plugs'],
  'AUTOLITE': ['Electrical', 'Spark Plugs'],
  'CANDLEPOWER': ['Electrical', 'Illumination'],
  'TRAIL TECH': ['Electrical', 'Gauges/Meters', 'Illumination'],
  'ACCEL': ['Electrical', 'Spark Plugs'],
  'CHRIS PRODUCTS': ['Electrical', 'Illumination'],
  'KOSO': ['Electrical', 'Gauges/Meters'],
  'YUASA': ['Electrical', 'Batteries'],
  'ANTIGRAVITY': ['Electrical', 'Batteries'],
  'BATTERY TENDER': ['Electrical', 'Batteries'],
  'NOCO GENIUS': ['Electrical', 'Batteries'],
  'TECMATE': ['Electrical', 'Batteries'],
  'MOTOBATT': ['Electrical', 'Batteries'],
  
  // Drive/Chain brands
  'DID': ['Drive', 'Chains'],
  'EK': ['Drive', 'Chains'],
  'RK EXCEL': ['Drive', 'Chains'],
  'DIAMOND CHAIN': ['Drive', 'Chains'],
  'JT': ['Drive', 'Sprockets', 'Chains'],
  'SUNSTAR': ['Drive', 'Sprockets'],
  'SUPERSPROX': ['Drive', 'Sprockets'],
  'RENTHAL': ['Drive', 'Sprockets', 'Handlebars'],
  
  // Fuel system brands
  'MIKUNI': ['Intake/Carb/Fuel System', 'Jets'],
  'WALBRO': ['Intake/Carb/Fuel System'],
  'FACTORY PRO': ['Intake/Carb/Fuel System', 'Jets'],
  'DYNOJET': ['Intake/Carb/Fuel System', 'Jets'],
  'SUDCO': ['Intake/Carb/Fuel System', 'Jets'],
  'K&N': ['Intake/Carb/Fuel System', 'Air Filters'],
  'UNI': ['Intake/Carb/Fuel System', 'Air Filters'],
  'TWIN AIR': ['Intake/Carb/Fuel System', 'Air Filters'],
  'NO TOIL': ['Intake/Carb/Fuel System', 'Air Filters'],
  'PRO FILTER': ['Intake/Carb/Fuel System', 'Air Filters'],
  
  // Clutch brands
  'HINSON': ['Clutch'],
  'REKLUSE RACING': ['Clutch'],
  'WISECO': ['Clutch', 'Engine'],
  'BARNETT': ['Clutch'],
  'EBC': ['Clutch', 'Brakes'],
  
  // Handlebars/Controls brands
  'RENTHAL': ['Handlebars', 'Grips'],
  'PRO TAPER': ['Handlebars', 'Grips'],
  'ODI': ['Grips'],
  'GRAB ON': ['Grips'],
  'OURY': ['Grips'],
  'SCOTT': ['Grips', 'Protective/Safety'],
  'MOTION PRO': ['Cable/Hydraulic Control Lines', 'Tools'],
  
  // Protective gear brands
  'ALPINESTARS': ['Protective/Safety', 'Gloves', 'Footwear'],
  'FOX': ['Protective/Safety', 'Gloves'],
  'EVS': ['Protective/Safety', 'Guards/Braces'],
  'POD': ['Protective/Safety', 'Guards/Braces'],
  'ACERBIS': ['Protective/Safety', 'Body', 'Guards/Braces'],
  'POLISPORT': ['Protective/Safety', 'Body'],
  'MAIER': ['Body', 'Protective/Safety'],
  'UFO': ['Protective/Safety', 'Body'],
  
  // Apparel brands
  'FLY RACING': ['Protective/Safety', 'Gloves', 'Headgear', 'Jerseys'],
  'ALPINESTARS': ['Protective/Safety', 'Gloves', 'Footwear', 'Jerseys'],
  'FOX': ['Protective/Safety', 'Gloves', 'Jerseys'],
  'THOR': ['Protective/Safety', 'Gloves', 'Jerseys'],
  'O\'NEAL': ['Protective/Safety', 'Gloves', 'Jerseys'],
  'SCOTT': ['Protective/Safety', 'Eyewear', 'Gloves'],
  'GAERNE': ['Footwear'],
  'SIDI': ['Footwear'],
  'FORMA': ['Footwear'],
  
  // Tools and chemicals brands
  'MOTION PRO': ['Tools', 'Cable/Hydraulic Control Lines'],
  'CRUZ TOOLS': ['Tools'],
  'PARK TOOL': ['Tools'],
  'MAXIMA': ['Chemicals'],
  'MOTUL': ['Chemicals'],
  'CASTROL': ['Chemicals'],
  'BEL-RAY': ['Chemicals'],
  'SPECTRO': ['Chemicals'],
  'LUCAS': ['Chemicals'],
  'STA-BIL': ['Chemicals'],
  'ENGINE ICE': ['Chemicals'],
  'WD-40': ['Chemicals'],
  'PERMATEX': ['Chemicals'],
  'S100': ['Chemicals'],
  'PJ1': ['Chemicals'],
  'BIKE SPIRITS': ['Chemicals'],
  
  // Accessories brands
  'KOLPIN': ['Accessories', 'Racks', 'Storage Covers'],
  'POWERMADD': ['Accessories', 'Handguards'],
  'ACERBIS': ['Accessories', 'Fuel Containers', 'Handguards'],
  'TUFF JUG': ['Accessories', 'Fuel Containers'],
  'ROTOPAX': ['Accessories', 'Fuel Containers'],
  'FUELPAX': ['Accessories', 'Fuel Containers'],
  'NO-SPILL': ['Accessories', 'Fuel Containers'],
  'MIDWEST CAN': ['Accessories', 'Fuel Containers'],
  'NELSON-RIGG': ['Accessories', 'Luggage', 'Storage Covers'],
  'OGIO': ['Accessories', 'Luggage'],
  'GIVI': ['Accessories', 'Luggage', 'Mounts/Brackets']
}

// Get prioritized brands for specific product types
export function getPrioritizedBrandsForProductTypes(productTypes: string[]): string[] {
  const prioritizedBrands = new Set<string>()
  
  // Add brands that are relevant to the product types
  productTypes.forEach(productType => {
    Object.entries(BRAND_PRODUCT_TYPE_MAPPING).forEach(([brand, types]) => {
      if (types.includes(productType)) {
        prioritizedBrands.add(brand)
      }
    })
  })
  
  return Array.from(prioritizedBrands).sort()
}

// Get all brands not in the prioritized list
export function getOtherBrands(prioritizedBrands: string[]): string[] {
  const prioritizedSet = new Set(prioritizedBrands)
  return ['PATRIOT', 'BOLT', 'SHINDY', 'RASCAL GRAFIK', 'FLY RACING', 'RISK RACING', 'FIRE POWER', 'BEER OPTICS', 'EKS BRAND', 'DIRT DIGITS',
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
  'MOTOBATT', 'ARMOR VISION'].filter(brand => !prioritizedSet.has(brand)).sort()
}