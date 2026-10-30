import { FaInstagram, FaFacebookF, FaPinterestP, FaYoutube, FaXTwitter, FaLinkedinIn } from 'react-icons/fa6';
import { SOCIALS } from '../config/site';

const ICONS = {
  instagram: FaInstagram,
  facebook: FaFacebookF,
  pinterest: FaPinterestP,
  youtube: FaYoutube,
  x: FaXTwitter,
  linkedin: FaLinkedinIn,
};

const isPlaceholder = (url) => !url || url.startsWith('YOUR_');

export default function SocialLinks({ className = '', size = 'text-base', boxed = false }) {
  return (
    <ul className={`flex flex-wrap items-center gap-3 ${className}`}>
      {SOCIALS.map(({ key, label, url }) => {
        const Icon = ICONS[key];
        if (!Icon) return null;
        const placeholder = isPlaceholder(url);
        return (
          <li key={key}>
            <a
              href={placeholder ? '#' : url}
              target={placeholder ? undefined : '_blank'}
              rel="noopener noreferrer"
              aria-label={label}
              title={placeholder ? `${label}: add your link in src/config/site.js` : label}
              onClick={placeholder ? (e) => e.preventDefault() : undefined}
              className={`inline-flex items-center justify-center text-ink/70 transition-colors hover:text-accent ${size} ${
                boxed ? 'h-11 w-11 rounded-full border border-ink/20 hover:border-accent' : 'h-9 w-9'
              }`}
            >
              <Icon />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
