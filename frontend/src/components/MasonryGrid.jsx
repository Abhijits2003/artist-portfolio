import { useMemo } from 'react';
import { motion } from 'framer-motion';
import ArtworkCard from './ArtworkCard';
import useColumnCount from '../hooks/useColumnCount';

const clamp = (r) => Math.min(Math.max(r || 0.8, 0.45), 2.4);
const GAP = 'gap-5 sm:gap-6 lg:gap-8';

export default function MasonryGrid({ artworks, maxColumns = 4, animateKey = '' }) {
  const cols = useColumnCount(maxColumns);

  const columns = useMemo(() => {
    const out = Array.from({ length: cols }, () => ({ height: 0, items: [] }));
    artworks.forEach((a) => {
      const target = out.reduce((best, c) => (c.height < best.height - 0.001 ? c : best), out[0]);
      target.items.push(a);
      target.height += 1 / clamp(a.aspectRatio) + 0.5;
    });
    return out;
  }, [artworks, cols]);

  return (
    <div key={animateKey} className={`flex items-start ${GAP}`}>
      {columns.map((col, ci) => (
        <div key={ci} className="flex min-w-0 flex-1 flex-col gap-10 sm:gap-12">
          {col.items.map((a, ri) => (
            <motion.div
              key={a._id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -60px 0px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: Math.min(ci * 0.07 + ri * 0.02, 0.3) }}
            >
              <ArtworkCard artwork={a} />
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}

const SKELETON_RATIOS = [0.8, 1.25, 0.9, 0.75, 1.1, 0.85, 1.3, 0.8];

export function MasonrySkeleton({ count = 6, maxColumns = 4 }) {
  const cols = useColumnCount(maxColumns);
  const columns = Array.from({ length: cols }, () => []);
  for (let i = 0; i < count; i += 1) columns[i % cols].push(SKELETON_RATIOS[i % SKELETON_RATIOS.length]);
  return (
    <div role="status" aria-label="Loading artwork" className={`flex items-start ${GAP}`}>
      {columns.map((col, ci) => (
        <div key={ci} className="flex min-w-0 flex-1 flex-col gap-10 sm:gap-12">
          {col.map((r, i) => (
            <div key={i}>
              <div className="shimmer rounded-sm" style={{ aspectRatio: r }} />
              <div className="shimmer mt-4 h-5 w-2/3 rounded" />
              <div className="shimmer mt-2 h-4 w-1/3 rounded" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
