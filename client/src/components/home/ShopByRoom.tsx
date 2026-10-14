import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROOMS } from '../../lib/constants';

export const ShopByRoom: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-forme-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-forme-cream pb-6 gap-4">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-editorial font-semibold text-forme-terracotta">
              Spatial Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forme-charcoal">
              Curate By Room
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-forme-charcoal/70 max-w-sm font-sans">
            Designed around spatial flow, ambient light, and acoustic comfort across every living environment.
          </p>
        </div>

        {/* Room Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROOMS.map((room) => (
            <Link
              key={room.id}
              to={room.href}
              className="group flex flex-col space-y-3"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-forme-cream border border-forme-cream/60">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forme-charcoal/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <div className="absolute inset-x-4 bottom-4 text-white flex items-center justify-between">
                  <h3 className="font-serif text-2xl text-white">
                    {room.name}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transform transition-transform group-hover:translate-x-1">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
