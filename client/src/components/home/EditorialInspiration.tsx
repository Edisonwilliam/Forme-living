import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EditorialInspiration: React.FC = () => {
  const articles = [
    {
      id: 'art-of-the-monolith',
      category: 'Spatial Theory',
      readTime: '4 min read',
      title: 'The Art of the Monolith: Why Low Travertine Anchors Contemporary Spaces',
      excerpt: 'Exploring how geological permanence and low-profile silhouettes foster psychological grounding in expansive living rooms.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'tactile-restraint',
      category: 'Material Focus',
      readTime: '6 min read',
      title: 'Tactile Restraint: Pairing Textured Bouclé with Smoked European Oak',
      excerpt: 'A study in balance: how heavy natural weaves absorb ambient reverberation and soften architectural concrete lines.',
      image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'the-modern-sanctuary',
      category: 'Interior Rituals',
      readTime: '5 min read',
      title: 'The Quiet Sanctuary: Designing a Bedroom Without Visual Noise',
      excerpt: 'From recessed plinth beds to integrated joinery: creating private rooms optimized for regenerative stillness.',
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-forme-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-forme-cream pb-6 gap-4">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-editorial font-semibold text-forme-terracotta">
              The FORME Journal
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forme-charcoal">
              Editorial Inspiration
            </h2>
          </div>
          <Link
            to="/journal"
            className="text-xs uppercase tracking-editorial font-medium text-forme-charcoal hover:text-forme-terracotta transition-colors flex items-center space-x-1.5"
          >
            <span>Read All Journal Essays</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article key={article.id} className="group flex flex-col space-y-4">
              <div className="aspect-[16/10] overflow-hidden rounded-sm bg-forme-cream border border-forme-cream relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-[11px] uppercase tracking-editorial text-forme-taupe font-medium">
                  <span className="text-forme-terracotta">{article.category}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-forme-charcoal group-hover:text-forme-terracotta transition-colors leading-snug font-medium">
                  {article.title}
                </h3>

                <p className="text-xs text-forme-charcoal/70 leading-relaxed font-sans">
                  {article.excerpt}
                </p>

                <div className="pt-1">
                  <span className="text-xs uppercase tracking-editorial font-medium text-forme-olive group-hover:text-forme-terracotta flex items-center space-x-1 transition-colors">
                    <span>Read Essay</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
