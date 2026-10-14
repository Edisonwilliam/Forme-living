import React from 'react';
import { Truck, ShieldCheck, TreePine, Headset } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const guarantees = [
    {
      icon: Truck,
      title: 'White-Glove Placement',
      subtitle: 'Lagos & Abuja Direct',
      desc: 'Our specialized installation team delivers to your room of choice, assembles every component, and removes all packaging.',
    },
    {
      icon: ShieldCheck,
      title: '10-Year Frame Warranty',
      subtitle: 'Heirloom Integrity',
      desc: 'Every solid wood structure and internal frame is certified against structural defect for a full decade of daily living.',
    },
    {
      icon: TreePine,
      title: 'FSC-Certified Hardwoods',
      subtitle: 'Sustainable Forestry',
      desc: 'All European white oak and American walnut originates exclusively from responsibly managed, carbon-conscious forests.',
    },
    {
      icon: Headset,
      title: 'Dedicated Concierge',
      subtitle: 'Private Client Support',
      desc: 'Work directly with an interior advisor for finish swatches, custom dimensions, and tailored room layout consultations.',
    },
  ];

  return (
    <section className="py-16 lg:py-20 bg-forme-cream/30 border-t border-forme-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {guarantees.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.title} 
                className="flex flex-col space-y-3 p-6 bg-white/70 rounded-sm border border-forme-cream/80 hover:border-forme-taupe transition-colors"
              >
                <div className="w-10 h-10 rounded-sm bg-forme-cream flex items-center justify-center text-forme-terracotta">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-forme-charcoal font-medium">
                    {item.title}
                  </h4>
                  <span className="text-[11px] uppercase tracking-editorial text-forme-olive font-medium block">
                    {item.subtitle}
                  </span>
                </div>
                <p className="text-xs text-forme-charcoal/70 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
