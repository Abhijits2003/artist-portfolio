
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';
import FramedImage from './FramedImage';
import LikeButton from './LikeButton';
import SaveButton from './SaveButton';

export default function ArtworkCard({ artwork }) {
  const [likes, setLikes] = useState(artwork.likes ?? 0);

  const to = `/artwork/${artwork.slug || artwork._id}`;

  return (
    <article className="group">

      <Link
        to={to}
        aria-label={`View details: ${artwork.title}`}
        className="relative block rounded-sm transition-shadow duration-500 group-hover:shadow-[0_26px_44px_-26px_rgba(31,42,46,0.6)]"
      >
        <FramedImage
          src={artwork.images?.[0]}
          alt={artwork.title}
          className="rounded-sm bg-[#f0eee9]"
          imgClassName="group-hover:scale-[1.02]"
        />

        <div className="pointer-events-none absolute inset-0 flex items-end rounded-sm bg-gradient-to-t from-black/45 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100">

          <span className="translate-y-2 rounded-full bg-paper px-4 py-2 text-sm font-medium text-ink transition-transform duration-500 group-hover:translate-y-0 group-focus-within:translate-y-0">
            View details
          </span>

        </div>
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">

        <div className="min-w-0">
          <h3 className="font-display text-xl text-ink transition-colors group-hover:text-accent">
            <Link to={to}>
              {artwork.title}
            </Link>
          </h3>

          <p className="mt-0.5 text-sm text-leaf">
            {artwork.category}
          </p>
        </div>

        <SaveButton
          artworkId={artwork._id}
          className="mt-1 text-lg"
        />

      </div>

      {artwork.description && (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/65">
          {artwork.description}
        </p>
      )}

      <div className="mt-3 flex items-center gap-5 text-sm text-ink/65">

        <LikeButton
          artworkId={artwork._id}
          likes={likes}
          onLikes={setLikes}
        />

        <span
          className="inline-flex items-center gap-2"
          title="Views"
        >
          <FiEye aria-hidden="true" />
          <span className="tabular-nums">
            {(artwork.views ?? 0).toLocaleString('en-IN')}
          </span>
        </span>

      </div>

    </article>
  );
}
