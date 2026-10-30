import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiShare2, FiLink, FiCheck } from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF, FaPinterestP, FaXTwitter } from 'react-icons/fa6';

export default function ShareButton({ title, image, path, className = '' }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const box = useRef(null);

  const url = `${window.location.origin}${path || window.location.pathname}`;
  const absImage = image ? new URL(image, window.location.origin).href : '';
  const text = `${title}`;

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (e.type === 'keydown' ? e.key === 'Escape' : !box.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  const onMain = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return;
      }
    }
    setOpen((o) => !o);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt('Copy this link:', url);
    }
  };

  const enc = encodeURIComponent;
  const links = [
    { name: 'WhatsApp', Icon: FaWhatsapp, href: `https://wa.me/?text=${enc(`${text} ${url}`)}` },
    { name: 'Facebook', Icon: FaFacebookF, href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    {
      name: 'Pinterest',
      Icon: FaPinterestP,
      href: `https://pinterest.com/pin/create/button/?url=${enc(url)}&media=${enc(absImage)}&description=${enc(text)}`,
    },
    { name: 'X', Icon: FaXTwitter, href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(text)}` },
  ];

  return (
    <div ref={box} className={`relative ${className}`}>
      <button
        type="button"
        onClick={onMain}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 text-sm text-ink/80 transition-colors hover:text-accent"
      >
        <FiShare2 /> Share
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 top-full z-30 mt-3 w-52 overflow-hidden rounded-2xl border border-ink/15 bg-cream p-2 shadow-xl"
          >
            {links.map(({ name, Icon, href }) => (
              <li key={name} role="none">
                <a
                  role="menuitem"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink/80 hover:bg-sand/40 hover:text-accent"
                >
                  <Icon className="text-base" /> {name}
                </a>
              </li>
            ))}
            <li role="none">
              <button
                role="menuitem"
                onClick={copy}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-ink/80 hover:bg-sand/40 hover:text-accent"
              >
                {copied ? <FiCheck className="text-base" /> : <FiLink className="text-base" />}
                {copied ? 'Link copied' : 'Copy link'}
              </button>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
