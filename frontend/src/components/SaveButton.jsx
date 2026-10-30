import { FaBookmark, FaRegBookmark } from 'react-icons/fa6';
import useStoredList from '../hooks/useStoredList';

export default function SaveButton({ artworkId, className = '', label = false }) {
  const favs = useStoredList('favorite_artworks');
  const saved = favs.has(artworkId);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        favs.toggle(artworkId);
      }}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from favorites' : 'Save to favorites'}
      className={`inline-flex items-center gap-2 text-sm transition-colors hover:text-accent ${
        saved ? 'text-accent' : 'text-ink/80'
      } ${className}`}
    >
      {saved ? <FaBookmark /> : <FaRegBookmark />}
      {label && <span>{saved ? 'Saved' : 'Save'}</span>}
    </button>
  );
}
