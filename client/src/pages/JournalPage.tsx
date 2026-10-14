import React, { useState } from 'react';
import { Sparkles, Clock, ArrowRight, X } from 'lucide-react';

interface JournalArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
  excerpt: string;
  content: string[];
}

const ARTICLES: JournalArticle[] = [
  {
    id: 'travertine-poetics',
    title: 'The Poetics of Honed Roman Travertine in Contemporary Living',
    category: 'Material Inquiry',
    readTime: '6 Min Read',
    date: 'October 2025',
    author: 'Kelechi Nwosu, Lead Stone Curator',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    excerpt: 'Examining the geological memory of porous sedimentary stone and why unfilled travertine creates quiet focal points in high-ceiling residences.',
    content: [
      'Travertine is not merely a surface; it is a mineral ledger of subterranean springs, heat, and seismic shifts across millenia. In ancient Rome, it was celebrated for its thermal resilience; in contemporary architecture, its unpolished matte texture provides a grounding tactile counterbalance to floor-to-ceiling glass and polished concrete.',
      'Unlike polished marble, which reflects light with rigid precision, honed travertine absorbs and gently diffuses afternoon glare. The natural vesicular pockets left unfilled celebrate the wabi-sabi philosophy of organic imperfection.',
      'To care for travertine in equatorial climates, avoid acidic cleaners. A simple wash with ph-neutral organic castile soap preserves the mineral wax seal, allowing the stone to breathe and develop its signature soft golden aura.',
    ],
  },
  {
    id: 'acoustic-boucle',
    title: 'Acoustic Sanctuary: How Curvilinear Bouclé Calms Concrete Architecture',
    category: 'Spatial Theory',
    readTime: '5 Min Read',
    date: 'September 2025',
    author: 'Amina Bello, Spatial Architect',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200',
    excerpt: 'Modern penthouse layouts with hard terrazzo and structural glazing require deliberate acoustic dampening through textured woven fibers.',
    content: [
      'As contemporary residential architecture moves towards expansive open-plan configurations with continuous glazing, sound reverberation emerges as an invisible stressor. Hard planar surfaces reflect high-frequency chatter and ambient city noise.',
      'Our sculptural Kanso curvilinear sofa was engineered to solve this dilemma organically. The looped curls of Belgian unbleached wool act as natural acoustic micro-diffusers, trapping reverberant sound waves and creating an auditory sanctuary.',
      'The curved geometry breaks up standing sound waves that typically reflect off parallel walls, establishing a cocoon of contemplative quiet in the very center of your living pavilion.',
    ],
  },
  {
    id: 'living-timber',
    title: 'The Living Timber: Embracing Movement in Solid Nigerian Walnut',
    category: 'Craftsmanship Heritage',
    readTime: '7 Min Read',
    date: 'August 2025',
    author: 'Adeyemi Cole, Master Joiner',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200',
    excerpt: 'Solid heartwood continues to breathe long after it leaves the workbench. How our floating slotted aprons accommodate seasonal humidity shifts.',
    content: [
      'A true timber artisan never treats wood as a dead substrate. Solid Nigerian walnut and White Oak remain hygroscopic throughout their lifespan, expanding in the humid coastal breezes of Lagos and contracting under arid Harmattan winds.',
      'Mass-market furniture makers solve this by gluing thin paper veneers over non-moving sawdust particleboard. At FORME, we consider that an abdication of craft. Instead, we employ traditional slotted tabletop fasteners (Z-clips and sliding mortises) that allow the timber to breathe up to 8 millimeters across its width without splitting.',
      'When you run your hand across a FORME solid walnut table, you are feeling living wood joinery that will accommodate changing climates for three centuries.',
    ],
  },
];

export const JournalPage: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState<JournalArticle | null>(null);

  return (
    <div className="min-h-screen bg-forme-ivory py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-editorial text-forme-terracotta font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The FORME Journal</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-forme-charcoal">
            Inquiries in Form & Material
          </h1>
          <p className="text-sm sm:text-base text-forme-charcoal/70 font-sans leading-relaxed">
            Essays on architectural living, timber joinery philosophies, material durability, and the curation of contemplative domestic spaces.
          </p>
        </div>

        {/* Featured Lead Article */}
        <div className="bg-white border border-forme-cream shadow-sm grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          <div className="lg:col-span-7 h-80 lg:h-[450px]">
            <img
              src={ARTICLES[0].image}
              alt={ARTICLES[0].title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-xs font-mono text-forme-taupe">
                <span className="uppercase text-forme-terracotta font-semibold">
                  {ARTICLES[0].category}
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{ARTICLES[0].readTime}</span>
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-forme-charcoal leading-snug">
                {ARTICLES[0].title}
              </h2>
              <p className="text-xs sm:text-sm text-forme-charcoal/70 font-sans leading-relaxed">
                {ARTICLES[0].excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-forme-cream flex items-center justify-between">
              <span className="text-[11px] text-forme-taupe">{ARTICLES[0].author}</span>
              <button
                onClick={() => setActiveArticle(ARTICLES[0])}
                className="text-xs uppercase tracking-editorial text-forme-charcoal hover:text-forme-olive font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <span>Read Inquiry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ARTICLES.slice(1).map((art) => (
            <div
              key={art.id}
              className="bg-white border border-forme-cream shadow-sm flex flex-col justify-between overflow-hidden group"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-mono text-forme-taupe">
                    <span className="uppercase text-forme-olive font-semibold">{art.category}</span>
                    <span>•</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h3 className="font-serif text-xl text-forme-charcoal leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-forme-charcoal/70 font-sans leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-forme-cream flex items-center justify-between">
                  <span className="text-[11px] text-forme-taupe">{art.author}</span>
                  <button
                    onClick={() => setActiveArticle(art)}
                    className="text-xs uppercase tracking-editorial text-forme-charcoal hover:text-forme-terracotta font-semibold flex items-center space-x-1 transition-colors"
                  >
                    <span>Read Essay</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Article Reading Modal */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forme-charcoal/70 backdrop-blur-sm">
            <div className="bg-white max-w-3xl w-full border border-forme-cream shadow-2xl p-8 sm:p-12 space-y-6 max-h-[90vh] overflow-y-auto animate-fade-in">
              <div className="flex justify-between items-start border-b border-forme-cream pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-editorial text-forme-terracotta font-mono font-semibold">
                    {activeArticle.category} • {activeArticle.readTime}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-forme-charcoal">
                    {activeArticle.title}
                  </h2>
                  <p className="text-xs text-forme-taupe">{activeArticle.author} • {activeArticle.date}</p>
                </div>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="text-forme-taupe hover:text-forme-charcoal p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-72 object-cover rounded-sm border border-forme-cream"
              />

              <div className="space-y-4 text-sm text-forme-charcoal/80 leading-relaxed font-sans">
                {activeArticle.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="pt-4 border-t border-forme-cream flex justify-between items-center text-xs text-forme-taupe">
                <span>Published by FORME Living Atelier, Lagos</span>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-2 border border-forme-cream text-forme-charcoal uppercase tracking-editorial font-medium hover:bg-forme-cream/50"
                >
                  Back to Journal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
