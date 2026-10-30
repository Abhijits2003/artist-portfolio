import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ArtworkImage from './ArtworkImage';

const variants = {
  enter: (d) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
};

export default function Lightbox({ images, index, dir, title, onGo, onClose }) {
  const closeRef = useRef(null);
  const total = images.length;
  const multi = total > 1;
  const latest = useRef({});
  latest.current = { index, multi, onGo, onClose };

  useEffect(() => {
    const previousFocus = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e) => {
      const { index: i, multi: m, onGo: go, onClose: close } = latest.current;
      if (e.key === 'Escape') close();
      else if (m && e.key === 'ArrowLeft') go(i - 1);
      else if (m && e.key === 'ArrowRight') go(i + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previousFocus?.focus?.();
    };
  }, []);

  const onDragEnd = (_, { offset, velocity }) => {
    if (!multi) return;
    if (offset.x < -80 || velocity.x < -500) onGo(index + 1);
    else if (offset.x > 80 || velocity.x > 500) onGo(index - 1);
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${title}: full screen view`}
      className="fixed inset-0 z-[100] flex flex-col bg-paper/95 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 py-4" onClick={(e) => e.stopPropagation()}>
        <p className="font-display text-lg text-ink">
          {title}
          {multi && <span className="ml-4 text-sm text-ink/60 tabular-nums">{index + 1} / {total}</span>}
        </p>
        <button ref={closeRef} onClick={onClose} aria-label="Close full screen view" className="rounded-full p-3 text-2xl text-ink hover:text-accent">
          <FiX />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            drag={multi ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={onDragEnd}
            style={{ touchAction: 'pan-y' }}
            className="absolute inset-0 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <ArtworkImage src={images[index]} alt={`${title}, image ${index + 1} of ${total}`} fit="contain" className="max-h-full max-w-full" />
          </motion.div>
        </AnimatePresence>

        {multi && (
          <>
            <button onClick={(e) => { e.stopPropagation(); onGo(index - 1); }} aria-label="Previous image" className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full p-3 text-3xl text-ink/80 hover:text-accent sm:block">
              <FiChevronLeft />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onGo(index + 1); }} aria-label="Next image" className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full p-3 text-3xl text-ink/80 hover:text-accent sm:block">
              <FiChevronRight />
            </button>
          </>
        )}
      </div>

      {multi && (
        <div className="flex justify-center gap-2 overflow-x-auto px-4 py-4" onClick={(e) => e.stopPropagation()}>
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => onGo(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border transition-all ${i === index ? 'border-accent opacity-100' : 'border-transparent opacity-50 hover:opacity-90'}`}
            >
              <ArtworkImage src={src} alt="" className="h-full w-full" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
