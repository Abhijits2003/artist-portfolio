import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import PageTransition from '../components/PageTransition';
import MasonryGrid, { MasonrySkeleton } from '../components/MasonryGrid';
import { ErrorState, Empty } from '../components/StateMessage';
import useArtworks from '../hooks/useArtworks';
import { matchesQuery } from '../utils/search';
import { CATEGORIES } from '../config/site';

const SORTS = {
  newest: { label: 'Newest', fn: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) },
  liked: { label: 'Most liked', fn: (a, b) => (b.likes ?? 0) - (a.likes ?? 0) },
  viewed: { label: 'Most viewed', fn: (a, b) => (b.views ?? 0) - (a.views ?? 0) },
};

export default function Gallery() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const category = params.get('category') || 'All';
  const sort = SORTS[params.get('sort')] ? params.get('sort') : 'newest';
  const { artworks, loading, error, reload } = useArtworks();
  const searchRef = useRef(null);

  useEffect(() => {
    if (params.get('focus') === 'search') searchRef.current?.focus();
  }, [params]);

  const update = (key, value, fallback) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('focus');
        if (!value || value === fallback) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true }
    );

  const results = useMemo(
    () =>
      artworks
        .filter((a) => category === 'All' || (a.category || 'Other').toLowerCase() === category.toLowerCase())
        .filter((a) => matchesQuery(a, q))
        .sort(SORTS[sort].fn),
    [artworks, q, category, sort]
  );

  return (
    <PageTransition className="mx-auto max-w-[1400px] px-5 pb-8 pt-32 sm:px-8 sm:pt-36">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-5xl font-light uppercase tracking-[0.1em] text-ink sm:text-6xl">The Gallery</h1>
        {!loading && !error && (
          <p className="pb-2 text-sm text-ink/65" aria-live="polite">
            {results.length} {results.length === 1 ? 'artwork' : 'artworks'}
          </p>
        )}
      </div>

      <div className="mt-10 flex flex-col gap-5 border-y border-ink/10 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0" role="group" aria-label="Filter by category">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => update('category', c, 'All')}
              aria-pressed={category === c}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
                category === c ? 'border-ink bg-ink text-paper' : 'border-ink/20 text-ink/75 hover:border-accent hover:text-accent'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative sm:w-72">
            <FiSearch aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/55" />
            <input
              ref={searchRef}
              type="search"
              value={q}
              onChange={(e) => update('q', e.target.value, '')}
              placeholder="Search name, tag, category"
              aria-label="Search artwork"
              className="field pl-11"
            />
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="sort" className="text-sm text-ink/65">Sort</label>
            <select id="sort" value={sort} onChange={(e) => update('sort', e.target.value, 'newest')} className="field w-auto pr-8">
              {Object.entries(SORTS).map(([key, s]) => <option key={key} value={key}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-12">
        {loading && <MasonrySkeleton count={8} />}
        {error && <ErrorState message={error} onRetry={reload} />}
        {!loading && !error && results.length === 0 && (
          <Empty title={artworks.length ? 'Nothing matches that search' : 'The gallery is empty'}>
            {artworks.length ? (
              <button className="btn btn-ghost" onClick={() => setParams({}, { replace: true })}>Clear search and filters</button>
            ) : (
              <p>Add artwork in <code className="text-accent">backend/data/artworks.js</code>, then run <code className="text-accent">npm run seed</code>.</p>
            )}
          </Empty>
        )}
        {results.length > 0 && <MasonryGrid artworks={results} animateKey={`${category}|${sort}`} />}
      </div>
    </PageTransition>
  );
}
