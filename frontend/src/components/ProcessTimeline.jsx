import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

export default function ProcessTimeline({ steps = [] }) {
  const [openIndex, setOpenIndex] = useState(0);
  if (!steps.length) return null;

  return (
    <ol className="relative">
      <span aria-hidden="true" className="absolute bottom-4 left-[19px] top-4 w-px bg-gradient-to-b from-accent/60 via-sand to-transparent" />
      {steps.map((step, i) => {
        const open = openIndex === i;
        return (
          <motion.li
            key={`${step.title}-${i}`}
            className="relative pb-3 pl-14"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: Math.min(i, 3) * 0.05 }}
          >
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border font-display text-sm transition-colors duration-300 ${
                open ? 'border-accent bg-accent text-paper' : 'border-sand bg-paper text-ink/70'
              }`}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <button
              onClick={() => setOpenIndex(open ? -1 : i)}
              aria-expanded={open}
              aria-controls={`process-panel-${i}`}
              className="flex w-full items-center justify-between gap-4 py-2 text-left"
            >
              <span className="font-display text-xl text-ink">{step.title}</span>
              <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="text-ink/60">
                <FiChevronDown />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={`process-panel-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="max-w-prose pb-4 pt-1 leading-relaxed text-ink/70">{step.description}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </ol>
  );
}
