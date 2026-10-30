import { useEffect, useState } from 'react';
export default function ArtworkImage({ src, alt, fit = 'cover', className = '', ...rest }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-sand/50 via-cream to-paper p-6 text-center ${className}`}
      >
        <span className="font-display text-sm font-light text-ink/60">Image not found: {src || 'no path set'}</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      draggable={false}
      className={`${fit === 'contain' ? 'object-contain' : 'object-cover'} ${className}`}
      {...rest}
    />
  );
}
