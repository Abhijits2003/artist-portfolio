import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import MasonryGrid, { MasonrySkeleton } from '../components/MasonryGrid';
import { ErrorState, Empty } from '../components/StateMessage';
import useArtworks from '../hooks/useArtworks';
import useStoredList from '../hooks/useStoredList';

export default function Favorites() {
  const favs = useStoredList('favorite_artworks');
  const { artworks, loading, error, reload } = useArtworks();
  const saved = artworks.filter((a) => favs.has(a._id));

  return (
    <PageTransition className="mx-auto max-w-[1400px] px-5 pb-8 pt-32 sm:px-8 sm:pt-36">
      <h1 className="font-display text-5xl font-light uppercase tracking-[0.1em] text-ink sm:text-6xl">Favorites</h1>
      <p className="mt-4 max-w-lg text-ink/65">Saved in this browser only. No account needed.</p>

      <div className="mt-12">
        {loading && <MasonrySkeleton count={4} />}
        {error && <ErrorState message={error} onRetry={reload} />}
        {!loading && !error && saved.length === 0 && (
          <Empty title="No saved artwork yet">
            <p>Use the bookmark on any artwork to keep it here.</p>
            <Link to="/gallery" className="btn btn-solid mt-6">Browse the gallery</Link>
          </Empty>
        )}
        {saved.length > 0 && <MasonryGrid artworks={saved} />}
      </div>
    </PageTransition>
  );
}
