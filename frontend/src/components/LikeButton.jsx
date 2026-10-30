import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';
import { likeArtwork, unlikeArtwork } from '../api/client';
import useStoredList from '../hooks/useStoredList';

export default function LikeButton({ artworkId, likes, onLikes, className = '', showCount = true }) {
  const liked = useStoredList('liked_artworks');
  const isLiked = liked.has(artworkId);
  const busy = useRef(false);
  const [burst, setBurst] = useState(0);

  const handle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy.current) return;
    busy.current = true;
    try {
      if (isLiked) {
        const res = await unlikeArtwork(artworkId);
        liked.remove(artworkId);
        onLikes?.(res.likes);
      } else {
        const res = await likeArtwork(artworkId);
        liked.add(artworkId);
        onLikes?.(res.likes);
        setBurst((b) => b + 1);
      }
    } catch {
    } finally {
      busy.current = false;
    }
  };

  return (
    <button
      type="button"
      onClick={handle}
      aria-pressed={isLiked}
      aria-label={isLiked ? 'Unlike this artwork' : 'Like this artwork'}
      className={`relative inline-flex items-center gap-2 text-sm text-ink/80 transition-colors hover:text-accent ${className}`}
    >
      <span className="relative inline-flex">
        <motion.span
          key={isLiked ? 'on' : 'off'}
          initial={{ scale: isLiked ? 0.6 : 1 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 14 }}
          className={isLiked ? 'text-accent' : ''}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
        </motion.span>
        <AnimatePresence>
          {burst > 0 &&
            [0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={`${burst}-${i}`}
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 text-[8px] text-accent"
                initial={{ opacity: 1, x: 0, y: 0, scale: 0.6 }}
                animate={{ opacity: 0, x: (i - 2) * 11, y: -18 - (i % 2) * 8, scale: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <FaHeart />
              </motion.span>
            ))}
        </AnimatePresence>
      </span>
      {showCount && (
        <span className="relative inline-block min-w-[1.5ch] overflow-hidden tabular-nums">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={likes}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="inline-block"
            >
              {(likes ?? 0).toLocaleString('en-IN')}
            </motion.span>
          </AnimatePresence>
        </span>
      )}
    </button>
  );
}
