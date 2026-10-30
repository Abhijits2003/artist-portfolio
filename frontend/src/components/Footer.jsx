import { Link } from 'react-router-dom';
import SocialLinks from './SocialLinks';
import { SITE } from '../config/site';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl text-ink">{SITE.artistName}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/60">{SITE.tagline}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="space-y-2 text-sm text-ink/70">
            {[['/', 'Home'], ['/gallery', 'Gallery'], ['/about', 'About'], ['/commission', 'Commission'], ['/contact', 'Contact'], ['/favorites', 'Favorites']].map(([to, label]) => (
              <li key={to}><Link to={to} className="hover:text-accent">{label}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="mb-3 text-sm text-ink/70">Follow the journey</p>
          <SocialLinks boxed />
        </div>
      </div>
      <p className="border-t border-ink/10 py-5 text-center text-xs text-ink/60">
        © {new Date().getFullYear()} {SITE.artistName}. All artwork is the property of the artist.
      </p>
    </footer>
  );
}
