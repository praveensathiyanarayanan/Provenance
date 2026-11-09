// Luxury Real Estate Listing Data & Interactive Configuration
const PROPERTIES_DATA = [
  {
    id: "prop-1",
    title: "Commercial Spaces",
    subtitle: "Functional, Inspiring Environments For Businesses To Thrive.",
    category: "commercial",
    price: 1850000,
    priceFormatted: "$1,850,000",
    location: "Financial District, Miami, FL",
    neighborhoodName: "Brickell / Financial Hub",
    beds: "Creative Office",
    baths: "4 Restrooms",
    sqft: "4,200 Sq. Ft.",
    badge: "Commercial",
    hot: false,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85"
    ],
    features: [
      "Floor-to-Ceiling Acoustical Glass",
      "Direct High-Speed Fiber Backbone",
      "Private Boardroom & Executive Lounge",
      "LEED Platinum Certified Architecture",
      "Dedicated Subterranean Parking Bays"
    ],
    description: "Architectural purity meets executive prestige in this benchmark commercial flagship. Designed with high-volume ceiling heights, exposed monolithic concrete textures, and expansive curtain walls bathed in southern ambient sunlight.",
    neighborhood: {
      walkScore: 92,
      transitScore: 89,
      airportMins: 16,
      marinaMins: 6,
      topHighlight: "Adjacent to 40+ multinational headquarters & Michelin-starred dining."
    },
    virtualViews: [
      { name: "Executive Suite", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85" },
      { name: "Boardroom", url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=85" },
      { name: "Open Collaborative Hall", url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85" }
    ],
    floorPlan: [
      { name: "Executive Corner Office", size: "32' × 22'", desc: "Panoramic bay views with private restroom" },
      { name: "Boardroom & AV Suite", size: "26' × 18'", desc: "Acoustic treated conference facility" },
      { name: "Creative Studio Space", size: "48' × 28'", desc: "Flexible open-concept layout for 30+ team members" },
      { name: "Catering Pantry & Bar", size: "16' × 12'", desc: "Sub-Zero wine chiller and barista bar" }
    ]
  },
  {
    id: "prop-2",
    title: "Modern 3-Bedroom Villa in Downtown",
    subtitle: "Clean architectural lines with curated warm minimalist styling.",
    category: "villas",
    price: 450000,
    priceFormatted: "$450,000",
    location: "Downtown, Miami, FL",
    neighborhoodName: "Downtown Arts & Cultural District",
    beds: 3,
    baths: 2,
    sqft: "1,800 Sq. Ft.",
    badge: "Hot",
    hot: true,
    badges: ["Hot", "Price: $450,000", "Place: Miami, FL"],
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85"
    ],
    features: [
      "Custom Italian Boffi Millwork",
      "Terrazzo Flooring & Calacatta Marble",
      "Smart Climate & Lutron HomeWorks Automation",
      "Zero-Edge Saltwater Plunge Pool",
      "Private Gated Courtyard with Olive Trees"
    ],
    description: "An exceptional sanctuary situated in the energetic urban core. This villa balances brutalist concrete exterior volumes with tactile, warm oak interior finishes and seamless indoor-outdoor transition.",
    neighborhood: {
      walkScore: 96,
      transitScore: 92,
      airportMins: 14,
      marinaMins: 8,
      topHighlight: "Steps from Pérez Art Museum & Adrienne Arsht Center."
    },
    virtualViews: [
      { name: "Great Room & Atrium", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85" },
      { name: "Kitchen & Dining", url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85" },
      { name: "Master Suite", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85" },
      { name: "Pool Courtyard", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85" }
    ],
    floorPlan: [
      { name: "Great Living Room", size: "26' × 19'", desc: "Double height ceiling with glass slider walls" },
      { name: "Primary Master Suite", size: "20' × 16'", desc: "Dual walk-in wardrobes & spa en-suite" },
      { name: "Bedroom 2 (Guest Suite)", size: "15' × 14'", desc: "En-suite bath with courtyard views" },
      { name: "Bedroom 3 / Executive Studio", size: "14' × 13'", desc: "Integrated sound insulation & bespoke millwork" },
      { name: "Saltwater Pool Courtyard", size: "36' × 20'", desc: "Zero-edge plunge pool with outdoor summer kitchen" }
    ]
  },
  {
    id: "prop-3",
    title: "Interior Architecture",
    subtitle: "Seamlessly Integrating Form And Function.",
    category: "residential",
    price: 1250000,
    priceFormatted: "$1,250,000",
    location: "Biscayne Bay, Miami, FL",
    neighborhoodName: "Biscayne Bayfront",
    beds: 4,
    baths: 3.5,
    sqft: "3,100 Sq. Ft.",
    badge: "Architectural",
    hot: false,
    rating: 4.95,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85"
    ],
    features: [
      "Sculptural Floating Cantilever Staircase",
      "Double-Height Light Well & Inner Atrium",
      "Integrated Gaggenau Master Suite Kitchen",
      "Deep Soaking Freestanding Stone Bath",
      "Soundproof Architectural Studio Space"
    ],
    description: "A masterclass in proportions, texture, and light. Each space flows effortlessly into the next, utilizing natural stone, blackened steel accents, and hidden reveals for an uncompromising serene atmosphere.",
    neighborhood: {
      walkScore: 89,
      transitScore: 84,
      airportMins: 18,
      marinaMins: 4,
      topHighlight: "Direct deep-water boat slip and private bay promenade."
    },
    virtualViews: [
      { name: "Sculptural Living Gallery", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85" },
      { name: "Chef's Show Kitchen", url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85" },
      { name: "Zen Meditation Studio", url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85" }
    ],
    floorPlan: [
      { name: "Grand Foyer & Light Well", size: "18' × 14'", desc: "Sculptural staircase and glass atrium" },
      { name: "Living & Salon", size: "30' × 22'", desc: "Floor-to-ceiling bayfront view orientation" },
      { name: "Culinary Wing", size: "22' × 16'", desc: "Hidden butler pantry and marble island" },
      { name: "Primary Oasis Suite", size: "24' × 18'", desc: "Private terrace overlooking the bay" }
    ]
  },
  {
    id: "prop-4",
    title: "The Monolith Pavilion",
    subtitle: "Raw board-formed concrete and cantilevered master terraces.",
    category: "villas",
    price: 2890000,
    priceFormatted: "$2,890,000",
    location: "Coconut Grove, FL",
    neighborhoodName: "Coconut Grove Enclave",
    beds: 5,
    baths: 5,
    sqft: "5,400 Sq. Ft.",
    badge: "Featured",
    hot: true,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85"
    ],
    features: [
      "Cantilevered Concrete Overhangs",
      "25-Meter Heated Lap Pool",
      "Subterranean 4-Vehicle Gallery",
      "Private Wine Tasting Cellar",
      "Custom Solar Energy & Battery Array"
    ],
    description: "An architectural tour de force combining raw structural brutalism with supreme residential warmth. Surrounding sub-tropical foliage complements crisp geometric concrete facades.",
    neighborhood: {
      walkScore: 84,
      transitScore: 78,
      airportMins: 20,
      marinaMins: 5,
      topHighlight: "Oldest lush tree canopy in Miami with secluded private estates."
    },
    virtualViews: [
      { name: "Cantilever Pavilion", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85" },
      { name: "Reflecting Lap Pool", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85" }
    ],
    floorPlan: [
      { name: "Great Monolith Hall", size: "38' × 24'", desc: "Massive concrete spans with hidden pocket doors" },
      { name: "Private Wine Cellar", size: "16' × 12'", desc: "1,200 bottle climate controlled vault" },
      { name: "Primary Wing", size: "28' × 20'", desc: "Cantilevered floating bedroom over the pool" }
    ]
  },
  {
    id: "prop-5",
    title: "Skyline Glass Penthouse",
    subtitle: "360-Degree panoramic ocean and city views from highest elevation.",
    category: "penthouses",
    price: 3750000,
    priceFormatted: "$3,750,000",
    location: "Brickell Key, Miami, FL",
    neighborhoodName: "Brickell Key Island",
    beds: 4,
    baths: 4.5,
    sqft: "4,600 Sq. Ft.",
    badge: "Exclusive",
    hot: false,
    rating: 4.98,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
    ],
    features: [
      "Private Sky Deck with Heated Jacuzzi",
      "Direct Keyed High-Speed Elevator Access",
      "Full Motorized Solar Shades & Curtains",
      "24/7 White-Glove Concierge & Valet",
      "Custom Italian Poliform Wardrobes"
    ],
    description: "Perched high above the city, this trophy penthouse provides unrivaled vistas of Biscayne Bay and glowing skyline sunsets. Every square foot has been curated by AD100 designers.",
    neighborhood: {
      walkScore: 95,
      transitScore: 90,
      airportMins: 15,
      marinaMins: 3,
      topHighlight: "Island exclusivity connected by bridge to Brickell's financial center."
    },
    virtualViews: [
      { name: "Sky Deck Panoramic", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85" },
      { name: "Living Horizon Lounge", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85" }
    ],
    floorPlan: [
      { name: "Grand Sky Salon", size: "34' × 26'", desc: "Wraparound 360-degree corner glass curtain" },
      { name: "Master Sky Sanctuary", size: "26' × 18'", desc: "Direct terrace access with outdoor soaking spa" }
    ]
  },
  {
    id: "prop-6",
    title: "Serene Minimalist Courtyard Residence",
    subtitle: "Harmonious indoor courtyards centered around ancient olive trees.",
    category: "residential",
    price: 920000,
    priceFormatted: "$920,000",
    location: "Coral Gables, FL",
    neighborhoodName: "Coral Gables Historic Biltmore",
    beds: 3,
    baths: 3,
    sqft: "2,600 Sq. Ft.",
    badge: "New Release",
    hot: false,
    rating: 4.92,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
    ],
    features: [
      "Limestone Courtyard with Reflection Pond",
      "Micro-cement Finishes Throughout",
      "Custom Timber Joinery in Natural Ash",
      "Integrated Sonos Ambient Sound Zones",
      "Spa Bathroom with Rainfall Skylight"
    ],
    description: "Designed as an escape from urban stimulation. Soft lime wash walls, recessed baseboards, and framed views into pocket courtyards bring tranquil rhythm to everyday living.",
    neighborhood: {
      walkScore: 82,
      transitScore: 75,
      airportMins: 15,
      marinaMins: 10,
      topHighlight: "Tree-lined boulevards and Mediterranean revival heritage."
    },
    virtualViews: [
      { name: "Central Courtyard", url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85" },
      { name: "Minimalist Lounge", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85" }
    ],
    floorPlan: [
      { name: "Central Olive Courtyard", size: "30' × 25'", desc: "Open sky atrium with reflection water basin" },
      { name: "Pavilion Living Room", size: "24' × 18'", desc: "Bi-folding Japanese style glass dividers" }
    ]
  }
];

const TESTIMONIALS_DATA = [
  {
    quote: "Finding an architecturally significant estate felt impossible until we collaborated with Provenance. Their curation is peerless, and the entire acquisition was executed with profound discretion.",
    author: "Elena Rostova",
    role: "Architectural Collector & Interior Designer",
    city: "Miami & Geneva",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    badge: "Biscayne Bay Estate"
  },
  {
    quote: "Their team's mastery of prime off-market properties and private negotiation secured both our flagship downtown commercial building and coastal sanctuary within three weeks.",
    author: "Marcus Vance",
    role: "Founder & Managing Partner, Horizon Capital",
    city: "New York & Palm Beach",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    badge: "Commercial & Residential"
  },
  {
    quote: "Provenance does not merely sell square footage; they represent monumental works of living art. The attention to acoustic engineering and material provenance is unparalleled.",
    author: "Sophia Sterling",
    role: "International Art Curator & Trustee",
    city: "London & Los Angeles",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    badge: "Modern Cantilever Villa"
  },
  {
    quote: "As an architect, I scrutinize structural tolerances and daylight orientation ruthlessly. Provenance is the only bureau that genuinely understands spatial integrity at an institutional level.",
    author: "Julian Chen, AIA",
    role: "Design Principal, Studio Chen & Partners",
    city: "Tokyo & San Francisco",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    badge: "Brutalist Residence"
  },
  {
    quote: "Absolute confidentiality was non-negotiable for our family office. Provenance delivered private off-market dossiers directly to our counsel without a single whisper in the public press.",
    author: "Victoria Alverez",
    role: "Director of Private Equity & Wealth",
    city: "Zurich & Singapore",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    badge: "Off-Market Trophy Asset"
  },
  {
    quote: "From deepwater yacht clearance to bespoke aviation logistics, their concierge and advisory desk handled every facet of our Mediterranean compound acquisition flawlessly.",
    author: "Lord Henrik Lindqvist",
    role: "Industrialist & Maritime Philanthropist",
    city: "Monaco & Stockholm",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    badge: "Waterfront Compound"
  }
];


// Showcase data for the 3 Partner Section elements highlighted by user
const PARTNER_SHOWCASE = [
  {
    id: "partner-1",
    title: "Sanctuary Interior: The Turner Living Pavilion",
    category: "Architectural Interior",
    tag: "Double-Height Atrium",
    staticImg: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=90",
    architect: "Studio Vincent Van Duysen",
    materials: "Honed Travertine, Belgian Linen, Smoked Oak Joinery",
    description: "An awe-inspiring sanctuary showcasing the iconic Turner architectural living room, nine-meter cantilevered ceilings, floor-to-ceiling acoustic glass, and seamless transitions between interior volumes."
  },
  {
    id: "partner-2",
    title: "Monolith Terraces: Brutalist Villa",
    category: "Brutalist Architecture",
    tag: "Cantilevered Concrete",
    staticImg: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=90",
    architect: "Olson Kundig Architects",
    materials: "Board-Formed Monolithic Concrete, Blackened Steel, Teak Decking",
    description: "A monumental contemporary residence with dramatic cantilevered overhangs, sunken courtyard firepits, and subtropical garden reflections."
  },
  {
    id: "partner-3",
    title: "Cascading Cantilevers: Glass Pavilion",
    category: "Minimalist Waterfront",
    tag: "Panoramic Glass Walls",
    staticImg: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=90",
    architect: "SAOTA Architecture & Design",
    materials: "Structural Glazing, White Terrazzo, Zero-Edge Pool System",
    description: "Frameless floor-to-ceiling glass pavilions that dissolve the boundary between luxurious interior comfort and tranquil ocean horizon."
  }
];
