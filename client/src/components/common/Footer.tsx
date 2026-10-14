import React, { useState } from 'react';
import { ArrowRight, Check, Instagram, Facebook, Linkedin, ShieldCheck, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRAND_NAME, BRAND_TAGLINE, BRAND_DESCRIPTION } from '../../lib/constants';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setIsSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-forme-charcoal text-forme-ivory pt-16 sm:pt-20 pb-12 border-t border-forme-olive/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top Editorial Row: Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 border-b border-forme-olive/40 pb-16">
          {/* Brand Manifesto */}
          <div className="lg:col-span-5 space-y-4">
            <span className="font-serif text-3xl sm:text-4xl text-forme-ivory tracking-tight font-semibold block">
              {BRAND_NAME}
            </span>
            <p className="font-serif text-lg text-forme-taupe italic">
              {BRAND_TAGLINE}
            </p>
            <p className="text-xs sm:text-sm text-forme-cream/70 max-w-md leading-relaxed font-sans">
              {BRAND_DESCRIPTION}
            </p>
            <div className="pt-2 flex items-center space-x-3 text-forme-taupe">
              <span className="text-xs tracking-editorial uppercase">Connect</span>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-forme-ivory transition-colors p-1" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-forme-ivory transition-colors p-1" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-forme-ivory transition-colors p-1" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Newsletter Subscription Column */}
          <div className="lg:col-span-7 bg-forme-dark/50 border border-forme-olive/40 p-6 sm:p-8 rounded-sm space-y-4">
            <div className="space-y-1.5">
              <span className="text-[11px] uppercase tracking-editorial text-forme-terracotta font-semibold block">
                The Editorial Dispatches
              </span>
              <h3 className="font-serif text-2xl text-forme-ivory">
                Receive private collection previews & interior essays.
              </h3>
              <p className="text-xs text-forme-taupe font-sans">
                Curated quarterly. No spam, solely architectural dialogues, material stories, and new release announcements.
              </p>
            </div>

            {isSubscribed ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-700/60 rounded-sm text-emerald-200 text-xs flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You have been subscribed to FORME Editorial Dispatches. Welcome to the studio circle.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-forme-taupe absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="w-full pl-10 pr-4 py-3 bg-forme-charcoal border border-forme-olive/60 rounded-sm text-xs text-forme-ivory placeholder:text-forme-taupe/60 focus:outline-none focus:border-forme-terracotta font-sans"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-forme-terracotta hover:bg-forme-terracotta/90 text-white text-xs uppercase tracking-editorial font-medium rounded-sm transition-colors flex items-center justify-center space-x-2 shrink-0"
                >
                  <span>Join Circle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          {/* Column 1 */}
          <div className="space-y-3">
            <h4 className="font-serif text-base text-forme-ivory font-medium">Collections</h4>
            <ul className="space-y-2 text-forme-taupe">
              <li><Link to="/shop?category=sofas" className="hover:text-forme-ivory transition-colors">The Living Edit</Link></li>
              <li><Link to="/shop?category=beds" className="hover:text-forme-ivory transition-colors">Bedroom Essentials</Link></li>
              <li><Link to="/shop?category=dining" className="hover:text-forme-ivory transition-colors">Dining in Style</Link></li>
              <li><Link to="/shop?category=workspace" className="hover:text-forme-ivory transition-colors">Workspace Collection</Link></li>
              <li><Link to="/shop?collection=new-arrivals" className="hover:text-forme-ivory transition-colors">New Releases</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <h4 className="font-serif text-base text-forme-ivory font-medium">The Studio</h4>
            <ul className="space-y-2 text-forme-taupe">
              <li><Link to="/story" className="hover:text-forme-ivory transition-colors">Design Philosophy</Link></li>
              <li><Link to="/journal" className="hover:text-forme-ivory transition-colors">Journal & Interiors</Link></li>
              <li><Link to="/admin" className="hover:text-forme-terracotta text-forme-terracotta/90 transition-colors font-mono">Atelier OS (Admin)</Link></li>
              <li><Link to="/sustainability" className="hover:text-forme-ivory transition-colors">Forestry & Sustainability</Link></li>
              <li><Link to="/trade" className="hover:text-forme-ivory transition-colors">Trade & Hospitality Program</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-3">
            <h4 className="font-serif text-base text-forme-ivory font-medium">Client Concierge</h4>
            <ul className="space-y-2 text-forme-taupe">
              <li><Link to="/delivery" className="hover:text-forme-ivory transition-colors">White-Glove Delivery</Link></li>
              <li><Link to="/warranty" className="hover:text-forme-ivory transition-colors">10-Year Warranty</Link></li>
              <li><Link to="/care" className="hover:text-forme-ivory transition-colors">Material Care Guides</Link></li>
              <li><Link to="/returns" className="hover:text-forme-ivory transition-colors">Complimentary Returns</Link></li>
              <li><Link to="/contact" className="hover:text-forme-ivory transition-colors">Studio Consultations</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="space-y-3">
            <h4 className="font-serif text-base text-forme-ivory font-medium">Lagos Atelier</h4>
            <div className="space-y-2 text-forme-taupe leading-relaxed">
              <p>Plot 14, Victoria Island Gallery District</p>
              <p>Lagos, Nigeria</p>
              <p className="pt-1 text-forme-ivory font-medium">+234 (01) 888-FORME</p>
              <p>concierge@formeliving.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div className="border-t border-forme-olive/40 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-forme-taupe space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-forme-olive" />
            <span>© {new Date().getFullYear()} {BRAND_NAME}. All architectural rights reserved.</span>
          </div>

          <div className="flex items-center space-x-6 text-[11px]">
            <Link to="/privacy" className="hover:text-forme-ivory transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-forme-ivory transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-forme-ivory transition-colors">Cookie Preferences</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
