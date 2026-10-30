import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSearch, FiMenu, FiX, FiHeart } from 'react-icons/fi';
import SocialLinks from './SocialLinks';
import SearchOverlay from './SearchOverlay';
import useStoredList from '../hooks/useStoredList';
import { SITE } from '../config/site';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/commission', label: 'Commission' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const { pathname } = useLocation();
  const favs = useStoredList('favorite_artworks');
  const closeSearch = useCallback(() => setSearch(false), []);


  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    onScroll();

    window.addEventListener('scroll', onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);


  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    if (!menu) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenu(false);
      }
    };

    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [menu]);

  const iconBtn =
    'relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[1.15rem] text-ink/75 transition-colors hover:bg-ink/5 hover:text-accent';

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: 0 }}
        className={`fixed inset-x-0 top-0 z-50 w-full transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          scrolled || menu
            ? 'bg-paper/85 shadow-[0_1px_0_rgba(31,42,46,0.08)] backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <nav
          aria-label="Main"
          className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr]"
        >
          <Link
            to="/"
            className="font-display text-xl tracking-wide text-ink sm:text-2xl"
          >
            {SITE.artistName}
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `relative block px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-ink'
                        : 'text-ink/65 hover:text-ink'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {l.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute inset-x-4 -bottom-0.5 h-px bg-accent"
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 40,
                          }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-0.5 lg:justify-self-end">
            <SocialLinks
              className="mr-2 hidden gap-0 xl:flex"
              size="text-[0.95rem]"
            />

            <button
              className={iconBtn}
              aria-label="Search artwork"
              onClick={() => setSearch(true)}
            >
              <FiSearch />
            </button>

            <Link
              to="/favorites"
              className={iconBtn}
              aria-label={`Favorites${favs.list.length ? ` (${favs.list.length})` : ''}`}
            >
              <FiHeart />

              {favs.list.length > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-paper">
                  {favs.list.length}
                </span>
              )}
            </Link>

            <button
              className={`${iconBtn} lg:hidden`}
              aria-label={menu ? 'Close menu' : 'Open menu'}
              aria-expanded={menu}
              aria-controls="mobile-menu"
              onClick={() => setMenu((open) => !open)}
            >
              {menu ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-paper px-6 pb-10 pt-28 lg:hidden"
          >
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{
                show: {
                  transition: {
                    staggerChildren: 0.06,
                    delayChildren: 0.08,
                  },
                },
              }}
            >
              {[...LINKS, { to: '/favorites', label: 'Favorites' }].map((l) => (
                <motion.li
                  key={l.to}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    },
                  }}
                  className="border-b border-ink/10"
                >
                  <NavLink
                    to={l.to}
                    end={l.end}
                    className={({ isActive }) =>
                      `flex items-center justify-between py-4 font-display text-3xl font-light ${
                        isActive ? 'text-accent' : 'text-ink'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10"
            >
              <SocialLinks boxed />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {search && <SearchOverlay onClose={closeSearch} />}
      </AnimatePresence>
    </>
  );
}