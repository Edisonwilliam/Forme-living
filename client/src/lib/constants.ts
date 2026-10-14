export const BRAND_NAME = 'FORME Living';
export const BRAND_TAGLINE = 'Contemporary Living & Architectural Furniture';
export const BRAND_DESCRIPTION =
  'Crafted for longevity and quiet elegance. Architectural forms, natural materials, and deliberate restraint for modern interiors.';

export const CURRENCY = {
  code: 'NGN',
  symbol: '₦',
  locale: 'en-NG',
  koboFactor: 100, // 1 NGN = 100 kobo
};

export const NAVIGATION_LINKS = [
  { name: 'Shop All', href: '/shop' },
  { name: 'Collections', href: '/collections' },
  { name: 'Rooms', href: '/rooms' },
  { name: 'New Arrivals', href: '/shop?collection=new-arrivals' },
  { name: 'Our Story', href: '/story' },
  { name: 'Journal', href: '/journal' },
];

export const CATEGORIES = [
  { id: 'sofas', name: 'Sofas & Seating', description: 'Deep comfort, sculptural silhouettes, and durable upholstery' },
  { id: 'beds', name: 'Beds & Bedroom', description: 'Minimalist platform beds and serene bedroom storage' },
  { id: 'dining', name: 'Dining Tables & Chairs', description: 'Solid timber and stone centerpieces for intimate gatherings' },
  { id: 'workspace', name: 'Home Office & Desks', description: 'Ergonomic precision wrapped in warm architectural timber' },
  { id: 'tables', name: 'Coffee & Side Tables', description: 'Low profiles in travertine, smoked glass, and brushed brass' },
  { id: 'storage', name: 'Wardrobes & Credenzas', description: 'Seamless integrated cabinetry and modular shelving systems' },
  { id: 'lighting', name: 'Architectural Lighting', description: 'Ambient illumination, spun metal pendants, and alabaster lamps' },
];

export const FEATURED_COLLECTIONS = [
  {
    id: 'the-living-edit',
    name: 'The Living Edit',
    subtitle: 'Curated Seating & Low Silhouettes',
    description: 'Designed for effortless rest and tactile contemplation.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200',
    itemCount: '18 Pieces',
  },
  {
    id: 'bedroom-essentials',
    name: 'Bedroom Essentials',
    subtitle: 'Quiet Sanctuary',
    description: 'Natural linens, oak joinery, and grounded platform silhouettes.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1200',
    itemCount: '14 Pieces',
  },
  {
    id: 'dining-in-style',
    name: 'Dining in Style',
    subtitle: 'Gathering & Ritual',
    description: 'Solid travertine and oiled walnut crafted for heirloom endurance.',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=1200',
    itemCount: '12 Pieces',
  },
  {
    id: 'workspace-collection',
    name: 'Workspace Collection',
    subtitle: 'Focus & Clarity',
    description: 'Thoughtful cable management and warm tactile surfaces for refined productivity.',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=1200',
    itemCount: '9 Pieces',
  },
];

export const ROOMS = [
  {
    id: 'living',
    name: 'Living Room',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1000',
    href: '/shop?category=sofas',
  },
  {
    id: 'dining',
    name: 'Dining Room',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=1000',
    href: '/shop?category=dining',
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1000',
    href: '/shop?category=beds',
  },
  {
    id: 'workspace',
    name: 'Home Office',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1000',
    href: '/shop?category=workspace',
  },
];
