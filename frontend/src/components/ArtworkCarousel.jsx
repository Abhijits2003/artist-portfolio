import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiMaximize2 } from 'react-icons/fi';
import ArtworkImage from './ArtworkImage';
import Lightbox from './Lightbox';

const variants = {
  enter: (d) => ({ x: d > 0 ? 70 : -70, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d) => ({ x: d > 0 ? -70 : 70, opacity: 0 }),
};

export default function ArtworkCarousel({ images = [], title }) {
  const total = images.length;
  const multi = total > 1;
  const [[index, dir], setState] = useState([0, 0]);
  const [open, setOpen] = useState(false);

  const go = useCallback(
    (target) => {
      if (total < 2) return;
      const next = ((target % total) + total) % total;
      setState(([cur]) => [next, target > cur || (cur === total - 1 && next === 0 && target >= total) ? 1 : -1]);
    },
    [total]
  );

  useEffect(() => {
    if (!multi || open) return undefined;
    const onKey = (e) => {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
      if (e.key === 'ArrowLeft') go(index - 1);
      if (e.key === 'ArrowRight') go(index + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [multi, open, index, go]);

  const onDragEnd = (_, { offset, velocity }) => {
    if (!multi) return;
    if (offset.x < -70 || velocity.x < -500) go(index + 1);
    else if (offset.x > 70 || velocity.x > 500) go(index - 1);
  };

  if (!total) return null;

  return (
    <div>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-cream sm:aspect-[5/6]">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            drag={multi ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={onDragEnd}
            onTap={() => setOpen(true)}
            style={{ touchAction: 'pan-y' }}
            className="absolute inset-0 cursor-zoom-in"
          >
            <ArtworkImage src={images[index]} alt={`${title}${multi ? `, image ${index + 1} of ${total}` : ''}`} fit="contain" className="h-full w-full" />
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => setOpen(true)}
          aria-label="View full screen"
          className="absolute right-3 top-3 z-10 rounded-full bg-paper/80 p-2.5 text-ink backdrop-blur hover:text-accent"
        >
          <FiMaximize2 />
        </button>

        {multi && (
          <>
            <button onClick={() => go(index - 1)} aria-label="Previous image" className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-paper/80 p-2.5 text-xl text-ink backdrop-blur hover:text-accent sm:block">
              <FiChevronLeft />
            </button>
            <button onClick={() => go(index + 1)} aria-label="Next image" className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-paper/80 p-2.5 text-xl text-ink backdrop-blur hover:text-accent sm:block">
              <FiChevronRight />
            </button>
          </>
        )}
      </div>

      {multi && (
        <>
          <div className="mt-4 flex items-center justify-center gap-5 text-ink/70">
            <button onClick={() => go(index - 1)} aria-label="Previous image" className="p-2 hover:text-accent sm:hidden"><FiChevronLeft /></button>
            <p aria-live="polite" className="font-display text-lg tabular-nums">{index + 1} / {total}</p>
            <button onClick={() => go(index + 1)} aria-label="Next image" className="p-2 hover:text-accent sm:hidden"><FiChevronRight /></button>
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {images.map((src, i) => (
              <button
                key={src + i}
                onClick={() => go(i)}
                aria-label={`Show image ${i + 1} of ${total}`}
                aria-current={i === index}
                className={`h-20 w-16 shrink-0 overflow-hidden rounded-lg border transition-all duration-300 ${i === index ? 'border-accent opacity-100' : 'border-transparent opacity-50 hover:opacity-90'}`}
              >
                <ArtworkImage src={src} alt="" className="h-full w-full" />
              </button>
            ))}
          </div>
        </>
      )}

      <AnimatePresence>
        {open && <Lightbox images={images} index={index} dir={dir} title={title} onGo={go} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
