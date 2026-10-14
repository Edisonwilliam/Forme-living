import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] bg-forme-charcoal text-forme-ivory overflow-hidden flex items-center">
      {/* Background Photography with Editorial Grading */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=85&w=2000"
          alt="Architectural living room with curved sculptural sofa and travertine table"
          className="w-full h-full object-cover object-center opacity-70 scale-100 transition-transform duration-1000 ease-out"
        />
        {/* Editorial Gradients for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-forme-charcoal/90 via-forme-charcoal/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-forme-charcoal via-transparent to-black/20" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="max-w-2xl space-y-8">
          {/* Release Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-editorial font-medium text-forme-terracotta bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2026/27 Architectural Collection</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-white font-medium"
          >
            Form defined by restraint. Made for living.
          </motion.h1>

          {/* Editorial Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-forme-cream/80 max-w-xl font-sans leading-relaxed"
          >
            Sculptural silhouettes, solid European oak, and natural travertine. Designed to bring grounded calm and tactile elegance to contemporary Nigerian homes.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
          >
            <Link
              to="/shop"
              className="px-8 py-4 bg-forme-terracotta hover:bg-forme-terracotta/90 text-white text-xs uppercase tracking-editorial font-medium rounded-sm transition-all shadow-forme-elevated flex items-center justify-center space-x-2"
            >
              <span>Explore The Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/shop?collection=the-living-edit"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 text-xs uppercase tracking-editorial font-medium rounded-sm transition-all flex items-center justify-center space-x-2"
            >
              <span>The Living Edit</span>
            </Link>
          </motion.div>

          {/* Micro Value Proposition Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-6 border-t border-white/15 grid grid-cols-3 gap-4 text-xs text-forme-taupe"
          >
            <div>
              <span className="font-serif text-lg text-white block">10-Year</span>
              <span>Frame Warranty</span>
            </div>
            <div>
              <span className="font-serif text-lg text-white block">White-Glove</span>
              <span>Lagos & Abuja Setup</span>
            </div>
            <div>
              <span className="font-serif text-lg text-white block">100% Solid</span>
              <span>FSC Certified Timber</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
