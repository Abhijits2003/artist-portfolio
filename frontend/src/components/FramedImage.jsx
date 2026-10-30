
import { useEffect, useRef, useState } from 'react';

export default function FramedImage({
  src,
  alt,
  className = '',
  imgClassName = ''
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const img = useRef(null);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  return (
    <div
      className={`relative w-full aspect-square overflow-hidden bg-[#f0eee9] ${className}`}
    >

      {!loaded && !failed && (
        <div
          className="shimmer absolute inset-0"
          aria-hidden="true"
        />
      )}

      {failed || !src ? (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 flex items-center justify-center p-4 text-center text-xs text-ink/60"
        >
          Image not found
          <br />
          {src}
        </div>
      ) : (
        <img
          ref={img}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-contain transition-[opacity,transform] duration-[900ms] ease-out ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}

    </div>
  );
}
