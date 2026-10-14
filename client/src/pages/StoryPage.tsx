import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, TreePine, Compass, Award } from 'lucide-react';

export const StoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-forme-ivory">
      {/* ── HERO BANNER ──────────────────────────────────────────────────────── */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-forme-cream overflow-hidden bg-white">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-editorial text-forme-terracotta font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The FORME Living Manifesto</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-forme-charcoal leading-tight">
            The Architecture of Sanctuary
          </h1>
          <p className="text-base sm:text-xl text-forme-charcoal/70 max-w-2xl mx-auto font-sans leading-relaxed">
            We build furniture not as temporary commodities, but as monumental quiet anchors for thoughtful living.
          </p>
        </div>
      </section>

      {/* ── ATELIER PHILOSOPHY ───────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-editorial text-forme-taupe font-mono">
              01 / Provenance & Heritage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-forme-charcoal">
              Conceived in Lagos. Crafted for Centuries.
            </h2>
            <p className="text-sm sm:text-base text-forme-charcoal/80 leading-relaxed font-sans">
              Founded in Victoria Island in 2019, FORME Living originated from a singular architectural observation: contemporary living spaces had become cluttered with fast furniture manufactured from synthetic composites and disposable plastic coatings.
            </p>
            <p className="text-sm sm:text-base text-forme-charcoal/80 leading-relaxed font-sans">
              We sought a return to fundamental truth in materials. By synthesizing West African timber traditions with Japanese mortise-and-tenon joinery and Scandinavian proportion, we create heirloom pieces that acquire grace and depth as they age alongside you.
            </p>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200"
              alt="Atelier Craftsman in Lagos"
              className="w-full h-[450px] object-cover rounded-sm shadow-xl border border-forme-cream"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 border border-forme-cream shadow-md max-w-xs hidden sm:block">
              <p className="font-serif text-sm text-forme-charcoal font-medium">
                "A home should be an unhurried sanctuary where every surface carries tactile integrity."
              </p>
              <span className="block text-[10px] uppercase tracking-editorial text-forme-taupe mt-2">
                — FORME Creative Studio
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MATERIALITY & JOINERY THREE PILLARS ──────────────────────────────── */}
      <section className="py-20 bg-forme-cream/30 border-y border-forme-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-editorial text-forme-olive font-semibold font-mono">
              02 / The Material Code
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-forme-charcoal">
              Purity Without Compromise
            </h2>
            <p className="text-xs sm:text-sm text-forme-charcoal/70 font-sans">
              We hold zero tolerance for MDF, synthetic chipboard, or artificial laminates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-forme-cream space-y-4">
              <div className="w-12 h-12 rounded-full bg-forme-ivory flex items-center justify-center text-forme-olive">
                <TreePine className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-forme-charcoal">
                Solid Certified Hardwood
              </h3>
              <p className="text-xs text-forme-charcoal/70 leading-relaxed font-sans">
                Kiln-dried Nigerian Black Walnut, Quarter-Sawn White Oak, and Smoked Ash. Every plank is matched for grain alignment and hand-finished with non-toxic organic botanical oils.
              </p>
            </div>

            <div className="bg-white p-8 border border-forme-cream space-y-4">
              <div className="w-12 h-12 rounded-full bg-forme-ivory flex items-center justify-center text-forme-terracotta">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-forme-charcoal">
                Honed Geological Stone
              </h3>
              <p className="text-xs text-forme-charcoal/70 leading-relaxed font-sans">
                Authentic Roman Travertine and Alabaster, quarried in blocks and left with subtle natural pitting and mineral striations that document millions of years of earth history.
              </p>
            </div>

            <div className="bg-white p-8 border border-forme-cream space-y-4">
              <div className="w-12 h-12 rounded-full bg-forme-ivory flex items-center justify-center text-forme-charcoal">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-forme-charcoal">
                Pure Wool Bouclé & Full-Grain
              </h3>
              <p className="text-xs text-forme-charcoal/70 leading-relaxed font-sans">
                Belgian unbleached wool bouclé textured yarns that resist pilling, and full-grain Italian leathers that develop an irreplaceable rich patina with every passing season.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUSTAINABLE REFORESTATION ────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forme-charcoal text-forme-ivory p-8 sm:p-14 rounded-sm flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-[10px] uppercase tracking-editorial text-forme-terracotta font-mono font-semibold">
              Reforestation Pledge
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white">
              Ten Trees for Every Commissioned Suite
            </h2>
            <p className="text-xs sm:text-sm text-forme-ivory/80 leading-relaxed font-sans">
              Through our forestry partnership with local West African conservation trusts in Ondo and Ogun states, we plant ten indigenous hardwood saplings for every piece commissioned, safeguarding rainforest biodiversity for future generations.
            </p>
          </div>

          <Link
            to="/shop"
            className="px-8 py-4 bg-forme-ivory text-forme-charcoal text-xs uppercase tracking-editorial font-medium hover:bg-forme-cream transition-colors flex items-center space-x-2 shrink-0"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
