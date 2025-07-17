# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Next.js 15 TypeScript e-commerce application for Four Speed Motorcycle Shop, built with React 19, Tailwind CSS 4, and integrating with the WPS (Wholesale Parts Service) API for motorcycle parts and accessories.

## Development Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application  
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run wps:endpoint` - Test WPS API endpoints using the custom script

## WPS API Testing
Use `node scripts/quick-endpoint-test.js` to test API endpoints:
- `node scripts/quick-endpoint-test.js vehiclemakes` - Test basic endpoint
- `node scripts/quick-endpoint-test.js items page[size]=5 include=product` - Test with parameters
- `node scripts/quick-endpoint-test.js items filter[brand_id]=135 sort[desc]=list_price` - Test filtering

## Architecture Overview

### API Layer (`src/lib/api/`)
- **wps-client.ts** - Comprehensive WPS API client with full TypeScript interfaces
  - Handles authentication, error handling, and pagination
  - Provides methods for products, items, brands, images, inventory, and cart operations
  - Includes utility classes for image URL generation and parameter cleaning
- **taxonomy-service.ts** - Hierarchical category navigation service
  - Manages the catalog taxonomy structure (Apparel, ATV, Bicycle, etc.)
  - Provides filtering by product type and category relationships
  - Includes React hooks for easy component integration
- **services.ts** - Additional API service utilities
- **examples.ts** - API usage examples and documentation

### Application Structure
- **App Router** - Uses Next.js 13+ app directory structure
- **TypeScript** - Full TypeScript with strict mode enabled
- **Path Aliases** - `@/*` maps to `src/*`
- **Styling** - Tailwind CSS 4 with custom configuration

### Key Pages
- `src/app/page.tsx` - Homepage
- `src/app/catalog/page.tsx` - Product catalog with API integration
- `src/app/api-test/page.tsx` - Development page for testing API endpoints

### Components
- `src/components/layout/Navigation.tsx` - Main navigation component
- `src/components/home/` - Homepage components (currently being restructured)

## Environment Configuration
Required environment variables (set in `.env.local`):
- `WPS_API_URL` or `NEXT_PUBLIC_WPS_API_URL` - WPS API base URL
- `WPS_API_TOKEN` or `NEXT_PUBLIC_WPS_API_TOKEN` - WPS API authentication token

## WPS API Integration Patterns

### Basic Usage
```typescript
import { createWPSClient } from '@/lib/api/wps-client';

const client = createWPSClient();
const products = await client.getProducts({ 'page[size]': 10 });
```

### Taxonomy Navigation
```typescript
import { TaxonomyNavigationService } from '@/lib/api/taxonomy-service';

const taxonomy = new TaxonomyNavigationService();
const mainCategories = await taxonomy.getMainCategories();
const filtered = await taxonomy.getFilteredItems(categoryId, 'suspension');
```

### Parameter Formatting
The WPS API uses Laravel-style parameters:
- Pagination: `page[size]=10`, `page[cursor]=xyz`
- Filtering: `filter[brand_id]=135`, `filter[name][pre]=query`
- Sorting: `sort[asc]=name`, `sort[desc]=price`
- Includes: `include=product,images`

## Testing and Development
- The project includes a custom endpoint testing script for rapid API development
- Use the `/api-test` page in development to test API integrations
- The WPS client includes comprehensive error handling and logging for debugging

## Current Development Status
- Homepage components are being refactored (some deleted files in git status)
- Catalog page has active WPS API integration
- Navigation structure is in place but may need updates
- Product taxonomy system is fully implemented with hierarchical categories

## WPS API ITEM - Unique Items types
Suspension, Hardware/Fasteners/Fittings, Promotional, Tire/Wheel Accessories, Drive, Intake/Carb/Fuel System, Graphics/Decals, Exhaust, Stands/Lifts, Mats/Rugs, Straps/Tie-Downs, Accessories, Grips, Gloves, Tools, Chemicals, Utility Containers, Fuel Containers, Eyewear, Sprockets, Winch, Mounts/Brackets, Trailer/Towing, Body, Windshield/Windscreen, Electrical, Engine, Protective/Safety, Wheels, Skis/Carbides/Runners, Plow, Plow Mount, Piston kits & Components, Track Kit, Footwear, Hyfax, Illumination, Clutch, Air Filters, Jets, Gaskets/Seals, Clamps, Mirrors, Oil Filters, Gas Caps, Foot Controls, Levers, Cable/Hydraulic Control Lines, Starters, Throttle, Audio/Visual/Communication, Switches, Onesies, Guards/Braces, Handguards, Engine Management, Spark Plugs, Brakes, Risers, Ice Scratchers, Headgear, Shirts, Steering, Tracks, Handlebars, Seat, Luggage, Watercraft Towables, Hand Controls, Belts, Fuel Tank, Flotation Vests, Racks, Helmet Accessories, Layers, Vests, Storage Covers, Socks, Gauges/Meters, Security, Suits, Wheel Components, Replacement Parts, Shorts, Hoodies, Jackets, Jerseys, Pants, Chains, UTV Cab/Roof/Door, Helmets, Batteries, Tires, Tubes, Farm/Agriculture, Rims, Bicycle Frames, Cranks, Tank Tops, Bike, Sweaters, GPS, Videos, Shoes, Tire And Wheel Kit, Undergarments, Forks, Food & Beverage, Winch Mount

## WPS API ITEM BRANDS - Unique Items brands
PATRIOT, BOLT, SHINDY, RASCAL GRAFIK, FLY RACING, RISK RACING, FIRE POWER, BEER OPTICS, EKS BRAND, DIRT DIGITS, SUNSTAR, KFI, SPORTECH, POWERMADD, EMGO, K&S, PDP, MIGHTY MINI, SP1, WPS, ISC, BLUHM, STRIDER, WISECO, CAMSO, YAKTRAX, AMERICAN MFG, POWERTYE, EPI, KORONIS, GARLAND, SLP, STRAIGHTLINE, WOODYS, HMK, HARDLINE, BAFFIN, K&L, EBC, SKF, FLUIDYNE, MOTION PRO, CANDLEPOWER, CHRIS PRODUCTS, MIKUNI, VERTEX, WSM, WALBRO, VISU-FILTER, KELCH, FULL THROTTLE, SPG, ROX, SNACKERPACKERS, PPD, WAHL BROS, SUDCO, STREETFX, LIL LIGHTNING, CYCLE SOUNDS, ATLANTIS, PUTCO, VOODOO, OPEN TRAIL, FLIP, AXIA, MOTO HOSE, SMOOTH, FLO MOTORSPORTS, ACERBIS, FUSION, SPEAQUA, DOBECK, FACTORY PRO, DAYTONA, DYNATEK, DYNOJET, TECHMOUNT, KYB, XTRIG, HELIX, NORMA, HELLA MARINE, NGK, FRAM, PCRACING, ALL BALLS, SNOSTUFF, STACOOL, OTTP, BTL DESIGNS, SLYDOG, CURVE, C&A, HINSON, KG, ROETIN, STUD BOY, GALFER, MAGURA, STREAMLINE, R&D, BLOWSION, HYDRO-TURF, HOT PRODUCTS, HT MOTO, KOLD KUTTER, KWIK TEK, AIRHEAD, SUPERCROSS, BOX, HSL, MACK STUDS, BRONCO, NAMURA, PROX, SOLAS, DSS, FOUR TWELVE, KPMI, X2, WORX, RACE TECH, COMET, MIKA METALS, ODI, ULTIMAX, DAYCO, JETTRIBE, PATHFINDER, RULE, JETWORKS, KOLPIN, BMP, PRO ARMOR, FROGZ SKIN, BDX, MBRP, SHOCKPROS, OUTERWEARS, RENTHAL, HARDDRIVE, ZAN, BOBSTER, RYDER CLIPS, MECHANIX, MISSING LINK, RZ MASK, PRO DESIGN, ZEE LINE, EAZYMOVE, PIVOT WORKS, RICKS, STA-BIL, CLYMER, MXL, ECHO, HANDY, WD-40, REVIVEX, LITTLE HOTTIES, GRABBER, SURE GRIP, CLASSIC ACC., COM. SEWING, SUPERCADDY, SNO-SKINZ, GEARS, MASQUE, TEKVEST, KREEM, TRI-FLOW, PROTECT ALL, COMP. CHEM., HELMET FRESH, PLEXUS, WORKSHOP HERO, MAXIMA, DOWCO, KOSO, MONKEY GRIP, COVERCRAFT, HEAROS, CHASE HARPER, NELSON-RIGG, GIVI, MSD, BULLY DOG, CYCLE ELECTRIC, ACCEL, SMP, LUNATI, BAZZAZ, SPEED-WAY SHELT, SDC, GEARBRAKE, NO-SPILL, RATIO RITE, TUFF JUG, LC, MIDWEST CAN, CANYON DANCER, MODQUAD, UPP, HELIBARS, QUICKLOADER, CALIBER, LOCKSTRAPS, SNOBUNJE, ANCRA, MOTO-GATE, CFR, HIGH ROLLER, AQUACART, CONDOR, VORTEX, VENOM PRODUCTS, BRAKING, K&N, SAFETY, FIRESTIK, WHIP IT, HIGHWAY 21, TRIPLE 9, KLEER VU, AMMCO, FIX-A-THRED, HAYDEN, AUTOLITE, COUNTRY ENT., HEAT DEMON, SYMTEC, AVON, A-ME, HOPKINS, FULTON, WESBAR, PLANO, SURE LOAD, HOT RODS, CYLINDER WORKS, SPEEDWERX, VE, HARTMAN, TIMBERSLED, NTN, EMERSON, RACEWERX, FABCRAFT, BETTER BOARDS, MOTO TECH, HOLESHOT, ATV TEK, AO COOLERS, HORNET, FUELPAX, ROTOPAX, DSG, GMAX, SLEDNECKS, FROGG TOGGS, DRAYKO, VENTURE, THERMACELL, SPIDI, TURTLE FUR, GAERNE, OGIO, YUASA, PBI, SCOTT, HABER, QUICK STRAP, LIQUID IMAGE, BOMBER, DRAW-TITE, REESE, ITP, PRO SERIES, SUPERCLAMP, TKI, RYDE FX, FOX, CIPA, BLENDZALL, JT, HIFLOFILTRO, ARC, HAMMERHEAD, NOCO GENIUS, BATTERY TENDER, TECMATE, PEET, IMS, SLIPSTREAMER, BUSS, RAPTOR, DR.D, XENA, MAIER, PIVOT PEGZ, PUIG, NATIONAL CYCLE, TC BROS, CRUZ TOOLS, FIXT, PARK TOOL, RK EXCEL, GRUNGE BRUSH, KNOBBYKNIFE, PJ1, SCHWALBE, PEDROS, STAR BRITE, KLUBER, FITCH, K100, BAUER, SMITHTOOL, WIZARDS, RED LINE, MASTER LOCK, METRO VAC, AWC, DEAD BOLT, KRYPTONITE, GRAB ON, ERNST, SEDONA, RACELINE, DWT, HIPER, GBC, BOYESEN, LUCAS, BIKE SPIRITS, TIROX, SPEEDO TUNER, PROFI, LUSTER LACE, BLUE JOB, MOTOREX, PSR, CYCLE SPRINGS, PROK, SPIDER, MOTO TASSINARI, 2 COOL, CARLISLE, OURY, MECHANICS, GASGACINCH, THREEBOND, PERMATEX, S100, DMP, DEVOL, PIAA, MOGO PARTS, TRAVELRITE, WARN, CYCLE COUNTRY, ALL RITE, J&S, BANKS, WALLINGFORDS, FIMCO, ORTOVOX, AMK, DEUTER, FUEL TOOL, YANA SHIKI, KEITI, COMP. WERKES, WILLIE & MAX, SEIZMIK, SSV WORKS, HIGH LIFTER, AQUA-HOT, IN-HOUSE, DUX, XPATV, BOSS AUDIO, NORREC, ZETA, DRC, POLISPORT, NITERIDER, STOMPGRIP, BEARD, RIGID, SPEED, WORKS, JETT, EVS, POD, TRAIL TECH, LIGHTSPEED, ALLSPORT, UNABIKER, ATHENA, P3, HOT CAMS, COMETIC, GATES, GASKET TECH., GET, JAMES GASKETS, ERLANDSON, NEWCOMB, EK, D.I.D, CRAMPBUSTER, SHOGUN, RAM, LEAD-DOG, SEER, F2P, CARDO, ADAPTIV, EKLIPES, GO CRUISE, TWIN AIR, DRAGON, BULLDOG, KABUTO, WEST-EAGLE, ENERGY SUSP., FMF, PRO FILTER, MAC, HMF, DEI, PRO CIRCUIT, PROCLEAN, LIQUID PERFORMANCE, HOG WASH, BBR, PRO-WHEEL, BYKAS, PREC. BILLET, FIGURE MACHINE, ALTO, ENERGY ONE, FEULING, ACCUTRONIX, NASH, MC BAGGERS, LYNDALL BRAKES, PRO PAD, GOODRIDGE, UNI, FREEDOM, MOTUL, BLUE MARBLE, MOROSO, DUBYA, BAKER, JAGG, BUTTY BUDDY, KB PISTONS, ROOKE, FORBIDDEN, ENGINE ICE, CASTROL, PIG SPIT, DANNY GRAY, WILD 1, GARDNERWESTCOTT, PAUGHCO, LINDBY, BEL-RAY, KLOTZ, SENA, WILCOX, SLIME, TRU-FLATE, COUNTERACT, RIDE-ON, TIRE PENZ, PLEWS/EDELMANN, INNOVATIONS, ARNOTT, NOVELLO, SDG INNOVATIONS, AIRHAWK, QUAD WORKS, CYCLE WORKS, D-COR, CYCLE PRO, EMD, DIAG4 BIKE, MICHELIN, PIRELLI, SHINKO, TUBLISS, ARISUN, EXCESS, MAXXIS, VSI, DRIVEN, IRC, CST, KINGS, METZELER, TALON, TORCO, SILKOLENE, NO TOIL, RACING 905, INSIGHT, RACE FACE, SINZ, TANGENT, PROMAX, ANARCHY, SPEEDLINE, YESS, CRUPI, LDC, RENNEN, KINGSTAR, BLACK CROWN, PROFILE, ALIENATION, EXUSTAR, E13, SDG COMPONENTS, TBR, J&M, SHOW CHROME (NEW), AQUATIC AV, FIREBRAND-OLD, NEW-RAY, TOP SHELF, GARMIN, MASTER, VURB, L.A. SLEEVE, MARSHALLS, N-STYLE, JUSTSAIL, REVARC, HYGEAR, GRANT, ALPINESTARS, REDI LITE, PHOENIX, ONE EMBLEMS, HOTBODIES, CP, PRO ONE, QUANTUM, ROCKET PERFORMANCE GARAGE LLC, PERFORMANCE TOOL, BLU, OLD STF, COLONY MACHINE, YOSHIMURA, RIVA, DRYGUY, SOCALMOTOGEAR, FLASH2PASS, UNIT, DURABLUE, SPIKE, RSI, CAT CRAP, TIER 1, ROKSTRAPS, ZBROZ, NAVATLAS, COOL-N-LUBE, TEXA, CV4, TRU TENSION, UCLEAR, MISCELLANEOUS, SCORPION EXO, EVANS, STKR, SCOSCHE, BRASS BALLS, GIANT LOOP, RACING BROTHERS, TTS, PRESTON PETTY, DRAGONFLY, TORCH IND., SUPERSPROX, HASTINGS MFG, FUNNELWEB, BLAC-RAC, ARROWHEAD, BAGGERNATION, JCRACING, FIRST ALERT, HT COMPONENTS, GROTE, BIG BIKE PARTS, ANTIGRAVITY, BOONDOCKER, EXTREME TEAM, JW SPEAKER, DUPONT, LOCK AND LOAD, BFGOODRICH, MOTOTRAX, NISSIN, MAGNAFLOW, PINGEL ENT, REKLUSE RACING, AIRPRO FORK, CALIFORNIA HEAT, EXTANG, CHASE, SPORTSTUFF, PSYCHIC, CYRON, MALLORY, GREEN LIGHT TRIGGERS, SO EASY RIDER, IDEAL, DEVIANT RACE PARTS, IBEXX, USI SKIS, SPECTRO, DIRT TRICKS, SAWICKI, GOLAN, DUNLOP, RALE INDUSTRIES, J STRONG, APM, COMPUFIRE, SPYKE, MOTOZORB, DIAMOND CHAIN, GBrakes, XK GLOW, ULTRAGARD, DIAMOND LED, ROCKER LOCKERS, HOPPE, SADDLE TRAMP, BLASTER, VP RACING, KENDA, SSI, KIDDE, USWE, WELD WHEELS, ENDURO ENGINEERING, NOMADIC, LECTRONS LLC, KENS FACTORY, NAMZ CUSTOM CYCLE, RUSTY BUTCHER, DK CUSTOM PRODUCTS, KODLIN USA, HARDSTREET, ONGUARD, FMF APPAREL, OXBOW GEAR LLC, FMF VISION, RIVAL POWERSPORTS USA, E-LINE ACCESSORIES, MAVERICK FISH HUNTER, MUC-OFF, FLAT OUT, HIGHSIDER, XTC POWER PRODUCTS, XTRA SEAL, GLUE TREAD, KRUZER KADDY, FIREBRAND, EAGLE GRIT, HOPNEL, MOTO POCKETS, ECOXGEAR, LETRIC LIGHTING CO, TAMER, CTEK, GLOVETACTS, SP CONNECT, JET PILOT, POWERBUILT, SANTORO FABWORX, FACTOR 55, TIGER LIGHTS, STOP & GO, IGRIP, MAMMUT, ELEMENT FIRE, BUBBA ROPES, JRI SHOCKS, S&S OFFROAD, HOFMANN DESIGNS, 100-PERCENT, CUSTOMACCES, CUSTOM ENGRAVING, BURLY BRAND, HAWG HALTERS INC, ABUS, RED BULL, REMA TIP TOP, DFG, RIZOMA, SHIN YO, PARTS COMPANY INC, ULTRACOOL, NEW RAGE CYCLES, SYSTEM 3, RST, LEN PERFORMANCE, CURT, DOMINO RACING, RKA, COBRA, WILD ASS, CERWIN VEGA, DIAMOND AUDIO, DBK, RM STATOR, MOTOBATT, ARMOR VISION

## API Response examples
### Attributes

```json
{
  "data": [
    {
      "id": 1,
      "name": "Product Type",
      "created_at": "2016-06-17 20:53:19",
      "updated_at": "2025-03-11 21:28:50"
    }
  ],
  "meta": {
    "cursor": {
      "current": "61poYD9eaDkR",
      "prev": null,
      "next": "qbWBe8Xe23DZ",
      "count": 1
    }
  }
}
```

### Brands

```json
{
  "data": [
    {
      "id": 1,
      "name": "509",
      "created_at": "2016-05-04 19:22:46",
      "updated_at": "2016-05-04 19:22:46"
    }
  ],
  "meta": {
    "cursor": {
      "current": "61poYD9eaDkR",
      "prev": null,
      "next": "qbWBe8Xe23DZ",
      "count": 1
    }
  }
}
```

### Countries

```json
{
  "data": [
    {
      "id": 1,
      "code": "AD",
      "name": "Andorra",
      "created_at": "2016-05-04 19:22:10",
      "updated_at": "2016-05-04 19:22:10"
    }
  ],
  "meta": {
    "cursor": {
      "current": "61poYD9eaDkR",
      "prev": null,
      "next": "qbWBe8Xe23DZ",
      "count": 1
    }
  }
}
```

### Features

```json
{
  "data": [
    {
      "id": 45,
      "product_id": 50608,
      "icon_id": null,
      "sort": 5,
      "name": "Comfort collar and wrist cuffs",
      "created_at": "2016-06-22 23:17:45",
      "updated_at": "2016-08-04 18:48:16"
    }
  ],
  "meta": {
    "cursor": {
      "current": "61poYD9eaDkR",
      "prev": null,
      "next": "qbWBe8Xe23DZ",
      "count": 1
    }
  }
}
```

### Images

```json
{
  "data": [
    {
      "id": 1,
      "domain": "cdn.wpsstatic.com/",
      "path": "images/",
      "filename": "1ee1-572a4c0b962a5.jpg",
      "alt": null,
      "mime": "image/jpeg",
      "width": 120,
      "height": 38,
      "size": 1988,
      "signature": "6e31167e6aa503c9a678327e4c174cbd995ee40f9a11e45efc6cf50ab3e98298",
      "created_at": "2016-05-04 19:22:51",
      "updated_at": "2017-02-23 18:00:23"
    }
  ],
  "meta": {
    "cursor": {
      "current": "61poYD9eaDkR",
      "prev": null,
      "next": "qbWBe8Xe23DZ",
      "count": 1
    }
  }
}
```

### Inventory

```json
{
  "data": [
    {
      "id": 1800,
      "item_id": 585114,
      "sku": "71-15014",
      "ca_warehouse": 0,
      "ga_warehouse": 0,
      "id_warehouse": 25,
      "in_warehouse": 25,
      "pa_warehouse": 0,
      "pa2_warehouse": 0,
      "tx_warehouse": 25,
      "total": 75,
      "created_at": "2020-09-09 22:35:20",
      "updated_at": "2025-05-24 01:01:13"
    }
  ],
  "meta": {
    "cursor": {
      "current": "61poYD9eaDkR",
      "prev": null,
      "next": "qbWBe8Xe23DZ",
      "count": 1
    }
  }
}
```

### Items

```json
{
  "data": [
    {
      "id": 387,
      "brand_id": 406,
      "country_id": null,
      "product_id": 6,
      "sku": "015-01001",
      "name": "MULTIRATE FORK SPRINGS 35MM",
      "list_price": "126.95",
      "standard_dealer_price": "92.18",
      "supplier_product_id": "FS-1017",
      "length": 24.5,
      "width": 4.7,
      "height": 1.9,
      "weight": 2.46,
      "upc": null,
      "superseded_sku": null,
      "status_id": "NA",
      "status": "NA",
      "unit_of_measurement_id": 12,
      "has_map_policy": false,
      "sort": 0,
      "created_at": "2016-06-17 20:47:51",
      "updated_at": "2025-03-27 12:39:05",
      "published_at": "2016-06-17 20:47:51",
      "product_type": "Suspension",
      "mapp_price": "0.00",
      "carb": null,
      "propd1": null,
      "propd2": null,
      "prop_65_code": null,
      "prop_65_detail": null,
      "drop_ship_fee": "FR",
      "drop_ship_eligible": true
    }
  ],
  "meta": {
    "cursor": {
      "current": "61poYD9eaDkR",
      "prev": null,
      "next": "qbWBe8Xe23DZ",
      "count": 1
    }
  }
}
```

### Products

```json
{
  "data": [
    {
      "id": 6,
      "designation_id": null,
      "name": "Multirate Fork Springs Kit",
      "alternate_name": null,
      "care_instructions": null,
      "description": "Our Multirate fork springs are produced from the best spring materials available. They are precision wound and stress relieved and mechanically polished to increase surface density to improve corrosion resistance. Straight rate springs have the same rate every inch that they are compressed, which is fine on flat super smooth roads but they lack the ability of our Multirate fork springs to handle some of the more unpredictable road conditions without sacrificing ride quality. If you have a heavier bike or increased load, try our new “GENISIS SERIES” fork springs.",
      "sort": 0,
      "image_360_id": null,
      "image_360_preview_id": null,
      "size_chart_id": null,
      "created_at": "2016-06-17 20:47:51",
      "updated_at": "2025-03-27 12:44:37"
    }
  ],
  "meta": {
    "cursor": {
      "current": "61poYD9eaDkR",
      "prev": null,
      "next": "qbWBe8Xe23DZ",
      "count": 1
    }
  }
}
```

### Resources

```json
{
  "data": [
    {
      "id": 1,
      "name": "Bolt Motorcycle Hardware",
      "type": "youtube",
      "reference": "YP1i9hkSYn8",
      "created_at": "2017-01-13 22:52:34",
      "updated_at": "2017-01-13 22:52:34"
    }
  ],
  "meta": {
    "cursor": {
      "current": "61poYD9eaDkR",
      "prev": null,
      "next": "qbWBe8Xe23DZ",
      "count": 1
    }
  }
}
```

### Tags

```json
{
  "data": [
    {
      "id": 1,
      "name": "Vests",
      "slug": "vests",
      "created_at": "2016-06-23 15:39:57",
      "updated_at": "2016-06-23 15:39:57"
    }
  ],
  "meta": {
    "cursor": {
      "current": "61poYD9eaDkR",
      "prev": null,
      "next": "qbWBe8Xe23DZ",
      "count": 1
    }
  }
}
```

### Taxonomyterms

```json
{
  "data": [
    {
      "id": 1,
      "vocabulary_id": 2,
      "parent_id": null,
      "name": "Plow",
      "slug": "plow",
      "description": null,
      "link": null,
      "link_target_blank": false,
      "left": 45,
      "right": 58,
      "depth": 0,
      "created_at": "2016-06-22 21:39:48",
      "updated_at": "2021-08-27 18:04:25"
    }
  ],
  "meta": {
    "cursor": {
      "current": "61poYD9eaDkR",
      "prev": null,
      "next": "qbWBe8Xe23DZ",
      "count": 1
    }
  }
}
```

### Vocabularies

```json
{
  "data": [
    {
      "id": 1,
      "name": "HDTwin Products",
      "description": "Product taxonomy for the hdtwin.com consumer site.",
      "created_at": "2016-06-17 21:57:34",
      "updated_at": "2016-07-11 16:10:33"
    }
  ],
  "meta": {
    "cursor": {
      "current": "61poYD9eaDkR",
      "prev": null,
      "next": "qbWBe8Xe23DZ",
      "count": 1
    }
  }
}
```

### Warehouses

```json
{
  "data": [
    {
      "id": 1,
      "db2_key": "ID",
      "name": "Boise",
      "created_at": "2017-03-01 17:49:23",
      "updated_at": "2017-03-01 17:49:23"
    }
  ],
  "meta": {
    "cursor": {
      "current": "61poYD9eaDkR",
      "prev": null,
      "next": "qbWBe8Xe23DZ",
      "count": 1
    }
  }
}
```
## Full WPS API Documentation Claude File name
- WPSAPIDocCLAUDE.pdf

## Authentication Research & Implementation Plan

### Research Date: 2025-01-16

**Requirements:**
- User accounts for order tracking
- Wishlist functionality 
- Future admin roles for blog management
- Next.js 15 compatibility

**Recommended Solution: Clerk Authentication**

**Why Clerk:**
- ✅ E-commerce focused with built-in order tracking
- ✅ Next.js 15 native integration 
- ✅ Role-based access control for admin features
- ✅ Generous free tier: 10,000 MAUs free
- ✅ Pro plan: $25/mo when needed
- ✅ $25M funded company (stable long-term)
- ✅ No charges for inactive users

**Alternative Comparison:**
- **NextAuth.js**: Open source but original dev abandoned, requires more dev work
- **Auth0**: Enterprise-grade but expensive, overkill for current size
- **Supabase**: Full backend solution but learning curve and database coupling

**Implementation Phases:**
1. **Phase 1 (Week 1-2)**: Basic accounts, registration/login, profile management
2. **Phase 2 (Week 3-4)**: Wishlist, saved addresses, email preferences  
3. **Phase 3 (Future)**: Admin roles, blog management, customer service tools

**Integration Points:**
- Connect with existing Zustand cart store
- Integrate with WPS API for order history
- Add account pages (profile, orders, wishlist)

### Implementation Status: ✅ COMPLETED (Phase 1)

**What's Been Implemented:**
- ✅ Clerk authentication setup with Next.js 15
- ✅ Sign-in, sign-up, and profile pages
- ✅ Navigation integration with user menu
- ✅ Protected routes middleware
- ✅ Basic orders and wishlist pages

**Authentication Features:**
- Email, Google, and Apple sign-in options
- User profile management
- Protected routes for user-specific pages
- Navigation shows user name when logged in
- Sign out functionality

**Next Steps (Phase 2):**
- Integrate with Zustand cart store for persistent user carts
- Add wishlist functionality to product pages
- Implement order history integration with WPS API
- Add user preferences and saved addresses