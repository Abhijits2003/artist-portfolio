import { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import PageTransition from '../components/PageTransition';
import FramedImage from '../components/FramedImage';
import MasonryGrid, { MasonrySkeleton } from '../components/MasonryGrid';
import FollowJourney from '../components/FollowJourney';
import { ErrorState } from '../components/StateMessage';
import useArtworks from '../hooks/useArtworks';
import { SITE, HOME_ARTIST_NOTE } from '../config/site';

const EASE = [0.22, 1, 0.36, 1];
const HEADLINE = ['ART', 'THAT', 'TELLS', 'A'];

const SLOTS = [
  { ratio: 0.78, tone: 'bg-accent/15', float: 7 },
  { ratio: 1.3, tone: 'bg-leaf/20', float: 8.5 },
  { ratio: 0.85, tone: 'bg-sand', float: 6.5 },
];

function HeroFrame({ artwork, slot, delay, still }) {
  const ratio = artwork?.aspectRatio || slot.ratio;
  const picture = artwork ? (
    <FramedImage src={artwork.images?.[0]} alt={artwork.title} ratio={ratio} />
  ) : (
    <div className={slot.tone} style={{ aspectRatio: ratio }} aria-hidden="true" />
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 48, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      <motion.div
        animate={still ? undefined : { y: [0, -9, 0] }}
        transition={{ duration: slot.float, repeat: Infinity, ease: 'easeInOut' }}
        className="bg-white p-2 shadow-[0_34px_60px_-34px_rgba(31,42,46,0.55)] sm:p-3"
      >
        {artwork ? (
          <Link to={`/artwork/${artwork.slug || artwork._id}`} aria-label={`View ${artwork.title}`} className="block">
            {picture}
          </Link>
        ) : (
          picture
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const hero = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const yA = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70]);
  const yB = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 60]);
  const { artworks, loading, error, reload } = useArtworks();

  const top = useMemo(
    () => [...artworks].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0) || (b.views ?? 0) - (a.views ?? 0)),
    [artworks]
  );
  const heroPicks = top.slice(0, 3);
  const featured = top.slice(0, 6);

  return (
    <PageTransition>
      <section ref={hero} className="grain relative overflow-hidden">
        <div className="hero-glow absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[1400px] items-center gap-14 px-5 pb-24 pt-32 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-28 lg:pt-40">
          <div>
            <h1
              aria-label="Art that tells a story"
              className="flex flex-wrap gap-x-[0.26em] text-[clamp(2.9rem,7.4vw,6.4rem)] leading-[1] tracking-tight text-ink"
            >
              {[...HEADLINE, 'STORY'].map((word, i) => (
                <span key={word} className="overflow-hidden pb-[0.1em]" aria-hidden="true">
                  <motion.span
                    className={`inline-block ${word === 'STORY' ? 'italic text-accent' : ''}`}
                    initial={{ y: '115%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.95, delay: 0.2 + i * 0.1, ease: EASE }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p
              className="mt-8 max-w-md text-lg leading-relaxed text-ink/70 sm:text-xl"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
            >
              {SITE.tagline}
            </motion.p>
            <motion.div
              className="mt-10 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1, ease: EASE }}
            >
              <Link to="/gallery" className="btn btn-solid group">
                Explore Artwork <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link to="/commission" className="btn btn-ghost">Commission a Drawing</Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 items-start gap-4 sm:gap-6" aria-label="Selected artwork">
            <motion.div style={{ y: yA }} className="flex flex-col gap-4 sm:gap-6">
              <HeroFrame artwork={heroPicks[0]} slot={SLOTS[0]} delay={0.5} still={reduce} />
              <HeroFrame artwork={heroPicks[2]} slot={SLOTS[2]} delay={0.8} still={reduce} />
            </motion.div>
            <motion.div style={{ y: yB }} className="pt-10 sm:pt-20">
              <HeroFrame artwork={heroPicks[1]} slot={SLOTS[1]} delay={0.65} still={reduce} />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pt-20 sm:px-8" aria-labelledby="featured">
        <div className="mb-12 flex items-end justify-between gap-6 border-b border-ink/10 pb-5">
          <h2 id="featured" className="section-title">Featured artwork</h2>
          <Link to="/gallery" className="group inline-flex items-center gap-2 text-sm text-ink/70 hover:text-accent">
            Full gallery <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        {loading && <MasonrySkeleton count={6} maxColumns={3} />}
        {error && <ErrorState message={error} onRetry={reload} />}
        {!loading && !error && featured.length === 0 && (
          <p className="py-16 text-ink/65">
            No artwork yet. Add your artwork in <code className="text-accent">backend/data/artworks.js</code> and run <code className="text-accent">npm run seed</code>.
          </p>
        )}
        {featured.length > 0 && <MasonryGrid artworks={featured} maxColumns={3} />}
      </section>

      <motion.section
        className="mx-auto mt-28 max-w-[1400px] px-5 sm:px-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <div className="rounded-[2rem] bg-cream px-6 py-16 text-center sm:px-16 sm:py-24">
          <blockquote className="mx-auto max-w-3xl font-display text-3xl font-light leading-snug text-ink sm:text-4xl md:text-[2.6rem]">
            “{HOME_ARTIST_NOTE}”
          </blockquote>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/about" className="btn btn-ghost">Read the story</Link>
            <Link to="/commission" className="btn btn-solid">Commission a Drawing</Link>
          </div>
        </div>
      </motion.section>

      <FollowJourney className="py-28" />
    </PageTransition>
  );
}
