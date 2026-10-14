/**
 * FORME Living — Database Seeder
 * Run: npx tsx src/scripts/seed.ts
 *
 * Seeds the database with product and review data.
 * Safe to run multiple times — clears and re-seeds.
 */

import dns from 'dns';

// Ensure DNS servers are set for Windows SRV record resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore
}

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { Review } from '../models/Review';
import { User } from '../models/User';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/forme_living';

const SEED_PRODUCTS = [
  {
    name: 'Sylvan Curved 3-Seater Sofa',
    slug: 'sylvan-curved-sofa',
    description: 'An organic, sculptural silhouette upholstered in heavy tactile bouclé. The Sylvan Sofa features an FSC-certified kiln-dried hardwood frame and high-resiliency multi-density foam cushions designed to cradle the body while retaining architectural composure.',
    shortDescription: 'Sculptural curved sofa upholstered in textured Italian bouclé.',
    category: 'sofas',
    categoryLabel: 'Sofas & Seating',
    collections: ['the-living-edit', 'new-arrivals'],
    price: 185000000,
    compareAtPrice: 210000000,
    images: [
      { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200', alt: 'Sylvan Curved Sofa in Natural Bouclé', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1200', alt: 'Sylvan Sofa living room angle' },
    ],
    material: 'Oatmeal Bouclé & Solid Oak Base',
    color: 'Oatmeal Ivory',
    dimensions: { width: 240, depth: 105, height: 78, unit: 'cm' },
    variants: [
      { name: 'Oatmeal Ivory', sku: 'SYL-SOF-OAT', stock: 6, colorName: 'Oatmeal', colorHex: '#EDE8DF', material: 'Bouclé' },
      { name: 'Charcoal Heather', sku: 'SYL-SOF-CHA', stock: 4, colorName: 'Charcoal', colorHex: '#242522', material: 'Bouclé' },
      { name: 'Terracotta Rust', sku: 'SYL-SOF-TER', stock: 2, colorName: 'Terracotta', colorHex: '#B66E4B', material: 'Wool Blend' },
    ],
    sku: 'SYL-SOF-001',
    stock: 12,
    isPublished: true,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    rating: 4.9,
    reviewCount: 38,
    details: ['Sculptural curved profile with uninterrupted waterfall front', 'Solid European oak plinth base', 'High-density memory foam core with channeled feather-down wrap', 'Commercial-grade Martindale abrasion rating (>50,000 rubs)'],
    careInstructions: ['Vacuum regularly with a soft upholstery brush.', 'Blot liquid spills immediately.', 'Professional cleaning recommended annually.'],
    warrantyInfo: '10-Year Structural Frame Warranty & 2-Year Fabric Warranty',
    deliveryEstimate: '5–8 business days with white-glove assembly',
  },
  {
    name: 'Kanso Solid Oak Platform Bed',
    slug: 'kanso-oak-platform-bed',
    description: 'Rooted in Japanese joinery and Scandinavian visual restraint. The Kanso Bed is meticulously milled from solid European white oak with recessed plinth supports that create a serene floating aesthetic.',
    shortDescription: 'Solid oak low-profile platform bed with floating cantilever frame.',
    category: 'beds',
    categoryLabel: 'Beds & Bedroom',
    collections: ['bedroom-essentials'],
    price: 145000000,
    compareAtPrice: 165000000,
    images: [
      { url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1200', alt: 'Kanso Solid Oak Bed front view', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1200', alt: 'Kanso Bed bedroom setting' },
    ],
    material: 'Solid European White Oak',
    color: 'Natural Smoked Oak',
    dimensions: { width: 195, depth: 220, height: 85, unit: 'cm' },
    variants: [
      { name: 'King — Natural Oak', sku: 'KAN-BED-KNG-NAT', stock: 4, colorName: 'Natural', colorHex: '#C4A57B' },
      { name: 'King — Smoked Oak', sku: 'KAN-BED-KNG-SMK', stock: 3, colorName: 'Smoked', colorHex: '#5C4A3A' },
      { name: 'Queen — Natural Oak', sku: 'KAN-BED-QN-NAT', stock: 6, colorName: 'Natural', colorHex: '#C4A57B' },
    ],
    sku: 'KAN-BED-001',
    stock: 13,
    isPublished: true,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    rating: 4.7,
    reviewCount: 22,
    details: ['Solid European white oak — kiln dried to 8% moisture', 'Floating plinth base with hidden bolt joinery', 'Slatted oak headboard with integrated LED recess', 'Mattress clearance: 38cm underbed storage'],
    careInstructions: ['Wipe with a barely damp cloth.', 'Apply beeswax annually for nourishment.', 'Avoid prolonged direct sunlight exposure.'],
    warrantyInfo: '5-Year Solid Wood Structural Warranty',
    deliveryEstimate: '4–6 weeks lead time',
  },
  {
    name: 'Forma Oval Dining Table',
    slug: 'forma-oval-dining-table',
    description: 'A statement oval dining table crafted from a single slab of honed Calacatta marble set on a hand-welded blackened steel base.',
    shortDescription: 'Calacatta marble oval table on sculptural blackened steel base.',
    category: 'dining',
    categoryLabel: 'Dining',
    collections: ['dining-collection'],
    price: 320000000,
    compareAtPrice: 360000000,
    images: [
      { url: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=1200', alt: 'Forma Oval Dining Table with marble top', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=1200', alt: 'Dining table in styled setting' },
    ],
    material: 'Calacatta Marble & Blackened Steel',
    color: 'White Marble / Matte Black',
    dimensions: { width: 220, depth: 110, height: 76, unit: 'cm' },
    variants: [
      { name: 'Calacatta Marble', sku: 'FOR-DIN-CAL', stock: 3, colorName: 'Calacatta', colorHex: '#F5F0EB' },
      { name: 'Nero Marquina', sku: 'FOR-DIN-NER', stock: 2, colorName: 'Nero', colorHex: '#1C1C1C' },
    ],
    sku: 'FOR-DIN-001',
    stock: 5,
    isPublished: true,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    rating: 4.8,
    reviewCount: 15,
    details: ['20mm honed natural marble top — each slab unique', 'Hand-welded 12mm blackened mild steel base', 'Seats 6–8 comfortably', 'Marble sealed with penetrating nano-stone sealant'],
    careInstructions: ['Blot spills immediately — never wipe.', 'Re-seal with stone sealant every 12 months.', 'Use coasters and placemats.'],
    warrantyInfo: '2-Year Manufacturing Warranty',
    deliveryEstimate: '8–12 weeks with white-glove installation',
  },
  {
    name: 'Atelier Walnut Writing Desk',
    slug: 'atelier-walnut-writing-desk',
    description: 'A refined minimal workspace desk crafted from solid American black walnut with a hand-rubbed oil finish, floating brass-inlaid top, and integrated cable management tray.',
    shortDescription: 'Solid walnut desk with integrated cable management and brass detailing.',
    category: 'workspace',
    categoryLabel: 'Workspace',
    collections: ['workspace-edit'],
    price: 95000000,
    compareAtPrice: 112000000,
    images: [
      { url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=1200', alt: 'Atelier Writing Desk in walnut', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&q=80&w=1200', alt: 'Desk workspace detail' },
    ],
    material: 'Solid American Black Walnut',
    color: 'Dark Walnut',
    dimensions: { width: 160, depth: 72, height: 74, unit: 'cm' },
    variants: [
      { name: 'Walnut — 160cm', sku: 'ATL-DSK-WAL-160', stock: 5, colorName: 'Walnut', colorHex: '#5C3D1E' },
      { name: 'Walnut — 180cm', sku: 'ATL-DSK-WAL-180', stock: 3, colorName: 'Walnut', colorHex: '#5C3D1E' },
      { name: 'White Oak — 160cm', sku: 'ATL-DSK-OAK-160', stock: 4, colorName: 'White Oak', colorHex: '#D9C5A7' },
    ],
    sku: 'ATL-DSK-001',
    stock: 12,
    isPublished: true,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    rating: 4.6,
    reviewCount: 27,
    details: ['Solid American black walnut with hand-rubbed oil finish', 'Inset 3mm solid brass edge detailing', 'Integrated underdesk cable management tray', 'Adjustable anti-scratch levelling feet'],
    careInstructions: ['Apply quality Danish oil every 6–12 months.', 'Clean with a lightly dampened cloth.', 'Avoid direct sunlight to prevent bleaching.'],
    warrantyInfo: '3-Year Craftsmanship Warranty',
    deliveryEstimate: '3–5 weeks',
  },
  {
    name: 'Lunar Arc Floor Lamp',
    slug: 'lunar-arc-floor-lamp',
    description: 'A sweeping arc floor lamp with a hand-spun Italian marble base and textile-sheathed arm. Provides warm ambient illumination for living and reading spaces.',
    shortDescription: 'Arc lamp with marble base and textured linen shade.',
    category: 'lighting',
    categoryLabel: 'Lighting',
    collections: ['lighting-edit', 'the-living-edit'],
    price: 48500000,
    images: [
      { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1200', alt: 'Lunar Arc Floor Lamp in living room', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&q=80&w=1200', alt: 'Lamp shade detail' },
    ],
    material: 'Travertine Marble Base & Linen Shade',
    color: 'Travertine / Ecru',
    dimensions: { width: 45, depth: 45, height: 195, unit: 'cm' },
    variants: [
      { name: 'Travertine / Ecru Linen', sku: 'LUN-LMP-TRV-ECR', stock: 8, colorName: 'Travertine', colorHex: '#C9B9A0' },
      { name: 'Nero Marble / Ivory Linen', sku: 'LUN-LMP-BLK-IVY', stock: 5, colorName: 'Nero', colorHex: '#2C2C2C' },
    ],
    sku: 'LUN-LMP-001',
    stock: 13,
    isPublished: true,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    rating: 4.5,
    reviewCount: 19,
    details: ['Hand-turned Travertine marble base (14kg stability weight)', '200cm textile-wrapped adjustable boom arm', '40cm hand-sewn linen drum shade', 'Compatible with smart bulbs (E27 max 40W LED)'],
    careInstructions: ['Dust shade monthly with a soft lint roller.', 'Clean marble base with stone-safe cleaner.', 'Never wrap cord tightly around the arm.'],
    warrantyInfo: '2-Year Electrical & Structural Warranty',
    deliveryEstimate: '2–4 weeks',
  },
  {
    name: 'Serif Oak Side Table',
    slug: 'serif-oak-side-table',
    description: 'A deceptively simple side table whose legs taper with a subtle serif-style foot — a typographic detail translated to solid timber.',
    shortDescription: 'Typographically-inspired solid oak side table with serif foot detail.',
    category: 'tables',
    categoryLabel: 'Tables',
    collections: ['the-living-edit'],
    price: 28000000,
    images: [
      { url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1200', alt: 'Serif Oak Side Table', isPrimary: true },
    ],
    material: 'Solid White Oak',
    color: 'Natural White Oak',
    dimensions: { width: 50, depth: 50, height: 55, unit: 'cm' },
    variants: [
      { name: 'Natural White Oak', sku: 'SER-TBL-OAK-NAT', stock: 15, colorName: 'Natural', colorHex: '#D9C5A7' },
      { name: 'Black Stained Ash', sku: 'SER-TBL-ASH-BLK', stock: 10, colorName: 'Black', colorHex: '#1A1A1A' },
    ],
    sku: 'SER-TBL-001',
    stock: 25,
    isPublished: true,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    rating: 4.4,
    reviewCount: 31,
    details: ['Solid European white oak', 'Mortise-and-tenon joinery throughout', 'Hand-sanded finish (320-grit)', 'Water-based matte lacquer top coat'],
    careInstructions: ['Dust with a dry microfibre cloth.', 'Wipe with a slightly damp cloth for stains.'],
    warrantyInfo: '2-Year Manufacturing Warranty',
    deliveryEstimate: '1–2 weeks',
  },
  {
    name: 'Modena Linen Armchair',
    slug: 'modena-linen-armchair',
    description: 'A slender, upright Italian-inspired armchair upholstered in stonewashed Belgian linen. The chamfered solid oak legs and hand-applied wax finish give each piece its own character.',
    shortDescription: 'Italian-cut armchair upholstered in stonewashed Belgian linen.',
    category: 'sofas',
    categoryLabel: 'Sofas & Seating',
    collections: ['the-living-edit', 'new-arrivals'],
    price: 72000000,
    compareAtPrice: 85000000,
    images: [
      { url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=1200', alt: 'Modena Linen Armchair', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=1200', alt: 'Armchair detail and legs' },
    ],
    material: 'Stonewashed Belgian Linen & Solid Oak',
    color: 'Stone Linen',
    dimensions: { width: 76, depth: 82, height: 88, unit: 'cm' },
    variants: [
      { name: 'Stone Linen', sku: 'MOD-ARM-STN-LIN', stock: 7, colorName: 'Stone', colorHex: '#C9BCA9' },
      { name: 'Sage Green', sku: 'MOD-ARM-SGE-LIN', stock: 4, colorName: 'Sage', colorHex: '#7A8C72' },
      { name: 'Dusty Rose', sku: 'MOD-ARM-RSE-LIN', stock: 3, colorName: 'Rose', colorHex: '#C9A098' },
    ],
    sku: 'MOD-ARM-001',
    stock: 14,
    isPublished: true,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    rating: 4.7,
    reviewCount: 16,
    details: ['Slender sculptured silhouette', 'Stonewashed Belgian linen — pre-softened', 'Hand-chamfered solid oak legs with wax finish', 'Double-welt seam detailing at cushion edges'],
    careInstructions: ['Remove covers and machine wash at 30°C.', 'Air-dry flat — do not tumble dry.', 'Iron on medium heat while slightly damp.'],
    warrantyInfo: '3-Year Frame Warranty',
    deliveryEstimate: '4–6 weeks',
  },
  {
    name: 'Halo Ribbed Storage Cabinet',
    slug: 'halo-ribbed-storage-cabinet',
    description: 'A tall fluted oak cabinet with push-to-open doors and a brass halo handle. Internal shelving adjusts to your configuration.',
    shortDescription: 'Fluted oak storage cabinet with push-to-open doors and brass handles.',
    category: 'storage',
    categoryLabel: 'Storage',
    collections: ['bedroom-essentials', 'the-living-edit'],
    price: 118000000,
    images: [
      { url: 'https://images.unsplash.com/photo-1493957988430-a5f2e15f39a3?auto=format&fit=crop&q=80&w=1200', alt: 'Halo Ribbed Storage Cabinet', isPrimary: true },
    ],
    material: 'Fluted White Oak Veneer & Brass Hardware',
    color: 'Natural Oak & Satin Brass',
    dimensions: { width: 90, depth: 42, height: 180, unit: 'cm' },
    variants: [
      { name: 'Natural Oak / Brass', sku: 'HAL-CAB-OAK-BRS', stock: 5, colorName: 'Natural Oak', colorHex: '#D9C5A7' },
      { name: 'Smoked Oak / Black', sku: 'HAL-CAB-SMK-BLK', stock: 3, colorName: 'Smoked', colorHex: '#3D2E22' },
    ],
    sku: 'HAL-CAB-001',
    stock: 8,
    isPublished: true,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: false,
    rating: 4.3,
    reviewCount: 9,
    details: ['Precision-machined fluted oak veneer doors', 'Push-to-open soft-close mechanism — no visible handles', 'Adjustable internal shelves (3 positions)', 'Anti-tip wall anchor kit included'],
    careInstructions: ['Dust with a dry microfibre cloth.', 'Polish brass hardware with a beeswax cloth.'],
    warrantyInfo: '2-Year Manufacturing Warranty',
    deliveryEstimate: '5–8 weeks',
  },
];

const SEED_REVIEWS = [
  {
    authorName: 'Adaeze O.',
    rating: 5,
    title: 'Absolutely stunning piece',
    comment: 'The Sylvan sofa transformed my living room completely. The bouclé is incredibly plush and it arrived in perfect condition with professional assembly.',
    isVerifiedPurchase: true,
    isApproved: true,
    slugRef: 'sylvan-curved-sofa',
  },
  {
    authorName: 'Chidi N.',
    rating: 5,
    title: 'Worth every kobo',
    comment: 'Exceptional craftsmanship. The marble top on the Forma dining table has beautiful natural veining — better than the photos. Very happy.',
    isVerifiedPurchase: true,
    isApproved: true,
    slugRef: 'forma-oval-dining-table',
  },
  {
    authorName: 'Funmi A.',
    rating: 4,
    title: 'Beautiful desk, slightly delayed delivery',
    comment: 'The walnut desk is a dream to work at. The cable management is excellent. Delivery took 5 weeks but was worth the wait. Will order again.',
    isVerifiedPurchase: true,
    isApproved: true,
    slugRef: 'atelier-walnut-writing-desk',
  },
];

async function seed() {
  console.log('🌱 FORME Living — Starting database seed...\n');

  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB:', MONGO_URI);

  // Clear existing data
  await Promise.all([
    Product.deleteMany({}),
    Review.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing products & reviews');

  // Insert products
  const insertedProducts = await Product.insertMany(SEED_PRODUCTS);
  console.log(`✅ Seeded ${insertedProducts.length} products`);

  // Build a map of slug → product._id for reviews
  const productSlugMap = new Map(insertedProducts.map((p) => [p.slug, p._id]));

  // Seed reviews linked to real product IDs
  const reviewDocs = SEED_REVIEWS.map(({ slugRef, ...reviewData }) => ({
    ...reviewData,
    productId: productSlugMap.get(slugRef),
  })).filter((r) => r.productId != null);

  if (reviewDocs.length > 0) {
    await Review.insertMany(reviewDocs);
    console.log(`✅ Seeded ${reviewDocs.length} reviews`);
  }

  // Create a demo admin user if none exists
  const existingAdmin = await User.findOne({ role: 'admin' });
  if (!existingAdmin) {
    await User.create({
      name: 'FORME Admin',
      email: 'admin@formeliving.com',
      password: 'Admin@1234',
      role: 'admin',
    });
    console.log('✅ Created admin user: admin@formeliving.com / Admin@1234');
  }

  // Create a demo customer user if none exists
  const existingClient = await User.findOne({ email: 'client@formeliving.com' });
  if (!existingClient) {
    await User.create({
      name: 'Demo Client',
      email: 'client@formeliving.com',
      password: 'Client@1234',
      role: 'customer',
    });
    console.log('✅ Created demo customer: client@formeliving.com / Client@1234');
  }

  console.log('\n🎉 Seeding complete. FORME Living is ready!\n');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
