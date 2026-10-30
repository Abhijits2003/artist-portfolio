import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiX, FiArrowRight } from 'react-icons/fi';
import ArtworkImage from './ArtworkImage';
import useArtworks from '../hooks/useArtworks';
import { matchesQuery } from '../utils/search';

export default function SearchOverlay({ onClose }) {
  const navigate = useNavigate();
  const { artworks, loading, error } = useArtworks();
  const [q, setQ] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const results = useMemo(() => {
    const list = q.trim() ? artworks.filter((a) => matchesQuery(a, q)) : artworks;
    return list.slice(0, 6);
  }, [artworks, q]);

  const submit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/gallery?q=${encodeURIComponent(q.trim())}`);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[90] bg-ink/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Search artwork"
        initial={{ opacity: 0, y: -16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-[10vh] w-[min(92vw,640px)] overflow-hidden rounded-2xl bg-paper shadow-2xl"
      >
        <form onSubmit={submit} className="flex items-center gap-3 border-b border-ink/10 px-5">
          <FiSearch aria-hidden="true" className="text-xl text-ink/60" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, theme, category or tag"
            aria-label="Search artwork"
            className="h-16 flex-1 bg-transparent text-lg text-ink placeholder:text-ink/45 focus:outline-none"
          />
          <button type="button" onClick={onClose} aria-label="Close search" className="rounded-full p-2 text-xl text-ink/60 hover:text-accent">
            <FiX />
          </button>
        </form>

        <div className="max-h-[55vh] overflow-y-auto p-3">
          {loading && <p className="px-3 py-8 text-center text-sm text-ink/60">Loading</p>}
          {error && <p className="px-3 py-8 text-center text-sm text-ink/70">{error}</p>}
          {!loading && !error && results.length === 0 && <p className="px-3 py-8 text-center text-sm text-ink/60">No artwork matches that search.</p>}
          {!loading && !error && results.length > 0 && (
            <>
              <p className="px-3 pb-2 pt-1 text-xs uppercase tracking-widest text-ink/60">{q.trim() ? 'Results' : 'Latest'}</p>
              <ul>
                {results.map((a) => (
                  <li key={a._id}>
                    <Link
                      to={`/artwork/${a.slug || a._id}`}
                      onClick={onClose}
                      className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-cream"
                    >
                      <ArtworkImage src={a.images?.[0]} alt="" className="h-14 w-14 shrink-0 rounded-lg" />
                      <span className="min-w-0">
                        <span className="block truncate font-display text-lg text-ink">{a.title}</span>
                        <span className="block truncate text-sm text-ink/60">{[a.category, a.medium].filter(Boolean).join(', ')}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {q.trim() && (
          <button onClick={submit} className="flex w-full items-center justify-between border-t border-ink/10 px-5 py-4 text-sm text-ink/70 hover:text-accent">
            See all results for “{q.trim()}” <FiArrowRight />
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
