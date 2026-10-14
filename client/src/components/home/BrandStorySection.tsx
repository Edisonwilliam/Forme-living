import React from 'react';
import { ArrowRight, Compass, Feather, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BrandStorySection: React.FC = () => {
  const pillars = [
    {
      icon: Feather,
      title: 'Tactile Materiality',
      desc: 'We prioritize honest materials that age with dignity: unlacquered brass, natural Romano travertine, and vegetable-tanned full-grain leather.',
    },
    {
      icon: Compass,
      title: 'Proportional Restraint',
      desc: 'Free from decorative excess. Every arc, bevel, and shadow line is mathematically resolved to foster spatial serenity in contemporary homes.',
    },
    {
      icon: ShieldCheck,
      title: 'Generational Longevity',
      desc: 'Built using traditional mortise-and-tenon joinery and kiln-dried FSC hardwoods engineered to endure through multiple generations of daily life.',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-forme-cream/40 border-y border-forme-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image Composition */}
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/5] rounded-sm overflow-hidden bg-forme-cream border border-forme-cream shadow-forme-elevated">
              <img
                src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=1200"
                alt="Woodcraft artisan milling solid white oak joinery in workshop"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
            {/* Floating Editorial Quote Card */}
            <div className="hidden sm:block absolute -bottom-8 -right-6 max-w-xs bg-forme-ivory p-6 rounded-sm border border-forme-cream shadow-forme-modal space-y-2">
              <span className="text-[10px] uppercase tracking-editorial text-forme-terracotta font-semibold">
                Studio Philosophy
              </span>
              <p className="font-serif text-lg text-forme-charcoal leading-snug">
                "Furniture should not clamor for attention. It should ground the room with quiet composure."
              </p>
            </div>
          </div>

          {/* Right Column: Narrative & Pillars */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-editorial font-semibold text-forme-terracotta">
                Provenance & Craft
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forme-charcoal leading-[1.15]">
                An architectural response to mass-produced uniformity.
              </h2>
              <p className="text-sm sm:text-base text-forme-charcoal/80 font-sans leading-relaxed pt-2">
                FORME Living was conceived as an antidote to disposable trends. We collaborate directly with master woodcrafters, stone masons, and textile weavers across Europe and West Africa to produce timeless furnishings tailored for contemporary living spaces.
              </p>
            </div>

            {/* 3 Pillars */}
            <div className="space-y-6 pt-2">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div key={pillar.title} className="flex space-x-4 items-start">
                    <div className="w-10 h-10 rounded-sm bg-forme-cream flex items-center justify-center shrink-0 border border-forme-cream text-forme-olive">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif text-xl text-forme-charcoal font-medium">
                        {pillar.title}
                      </h4>
                      <p className="text-xs text-forme-charcoal/70 leading-relaxed font-sans">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4">
              <Link
                to="/story"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-editorial font-medium text-forme-charcoal hover:text-forme-terracotta transition-colors group"
              >
                <span>Read The Complete Atelier Story</span>
                <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
