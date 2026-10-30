import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye } from 'react-icons/fi';
import PageTransition from '../components/PageTransition';
import ArtworkCarousel from '../components/ArtworkCarousel';
import ProcessTimeline from '../components/ProcessTimeline';
import LikeButton from '../components/LikeButton';
import SaveButton from '../components/SaveButton';
import ShareButton from '../components/ShareButton';
import { Loading, ErrorState } from '../components/StateMessage';
import { getArtwork, registerView, errorMessage } from '../api/client';

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: 'easeOut' },
};

function viewedThisSession(id) {
  try {
    return JSON.parse(sessionStorage.getItem('viewed_artworks') || '[]').includes(id);
  } catch {
    return false;
  }
}
function markViewed(id) {
  try {
    const list = JSON.parse(sessionStorage.getItem('viewed_artworks') || '[]');
    sessionStorage.setItem('viewed_artworks', JSON.stringify([...new Set([...list, id])]));
  } catch {
  }
}

export default function ArtworkDetails() {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [status, setStatus] = useState('loading'); 
  const [message, setMessage] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    getArtwork(id)
      .then((data) => {
        if (cancelled) return;
        setArtwork(data);
        setLikes(data.likes ?? 0);
        setViews(data.views ?? 0);
        setStatus('ok');
        document.title = `${data.title} | Artist Portfolio`;
        if (!viewedThisSession(data._id)) {
          markViewed(data._id);
          registerView(data._id).then((r) => !cancelled && setViews(r.views)).catch(() => {});
        }
      })
      .catch((err) => {
        if (cancelled) return;
        if (err?.response?.status === 404) setStatus('missing');
        else {
          setMessage(errorMessage(err, 'Could not load this artwork.'));
          setStatus('error');
        }
      });
    return () => {
      cancelled = true;
      document.title = 'Artist Portfolio';
    };
  }, [id, attempt]);

  if (status === 'loading') return <PageTransition className="pt-40"><Loading label="Loading artwork" /></PageTransition>;
  if (status === 'error') return <PageTransition className="pt-40"><ErrorState message={message} onRetry={() => setAttempt((n) => n + 1)} /></PageTransition>;
  if (status === 'missing')
    return (
      <PageTransition className="pt-40">
        <div className="mx-auto max-w-md py-20 text-center">
          <h1 className="text-3xl text-ink">This artwork could not be found</h1>
          <Link to="/gallery" className="btn btn-ghost mt-8">Back to the gallery</Link>
        </div>
      </PageTransition>
    );

  const a = artwork;
  const meta = [a.category, a.medium, a.year].filter(Boolean);

  return (
    <PageTransition className="mx-auto max-w-7xl px-5 pb-8 pt-32 sm:px-8">
      <Link to="/gallery" className="text-sm text-ink/60 hover:text-accent">Back to the gallery</Link>

      <div className="mt-6 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ArtworkCarousel key={a._id} images={a.images || []} title={a.title} />
        </div>

        <div>
          <h1 className="text-5xl uppercase tracking-[0.06em] text-ink sm:text-6xl">{a.title}</h1>
          {meta.length > 0 && <p className="mt-4 text-leaf">{meta.join(', ')}</p>}

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-y border-ink/10 py-5">
            <LikeButton artworkId={a._id} likes={likes} onLikes={setLikes} className="text-base" />
            <SaveButton artworkId={a._id} label className="text-base" />
            <ShareButton title={a.title} image={a.images?.[0]} path={`/artwork/${a.slug || a._id}`} />
          </div>
          <p className="mt-5 flex items-center gap-6 text-sm text-ink/60">
            <span>{likes.toLocaleString('en-IN')} {likes === 1 ? 'like' : 'likes'}</span>
            <span className="inline-flex items-center gap-2"><FiEye /> {views.toLocaleString('en-IN')} {views === 1 ? 'view' : 'views'}</span>
          </p>

          {a.tags?.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {a.tags.map((t) => (
                <li key={t}>
                  <Link to={`/gallery?q=${encodeURIComponent(t)}`} className="rounded-full border border-ink/15 px-3 py-1 text-xs text-ink/70 hover:border-accent hover:text-accent">{t}</Link>
                </li>
              ))}
            </ul>
          )}

          {a.description && (
            <motion.section {...reveal} className="mt-14">
              <h2 className="section-title text-xl sm:text-2xl">About this artwork</h2>
              <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink/75">{a.description}</p>
            </motion.section>
          )}

          {a.story && (
            <motion.section {...reveal} className="mt-14">
              <h2 className="section-title text-xl sm:text-2xl">The story behind the artwork</h2>
              <p className="mt-5 max-w-prose whitespace-pre-line text-lg leading-[1.85] text-ink/75">{a.story}</p>
            </motion.section>
          )}

          {a.process?.length > 0 && (
            <motion.section {...reveal} className="mt-14">
              <h2 className="section-title text-xl sm:text-2xl">How I created it</h2>
              <div className="mt-6"><ProcessTimeline steps={a.process} /></div>
            </motion.section>
          )}

          {a.artistNote && (
            <motion.section {...reveal} className="mt-14 border-l border-accent/50 pl-6">
              <h2 className="section-title text-xl sm:text-2xl">Artist note</h2>
              <p className="mt-5 max-w-prose font-display text-2xl font-light leading-snug text-ink sm:text-[1.7rem]">“{a.artistNote}”</p>
            </motion.section>
          )}

          <div className="mt-16">
            <Link to={`/commission`} className="btn btn-ghost">Commission something like this</Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
