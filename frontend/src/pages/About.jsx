
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import FollowJourney from '../components/FollowJourney';
import { ABOUT } from '../config/site';

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: 'easeOut' },
};

function Block({ title, children }) {
  return (
    <motion.section
      {...reveal}
      className="grid gap-4 border-t border-ink/10 py-12 md:grid-cols-[1fr_2fr] md:gap-12"
    >
      <h2 className="section-title text-xl sm:text-2xl">
        {title}
      </h2>

      <p className="max-w-prose text-lg leading-[1.85] text-ink/75">
        {children}
      </p>
    </motion.section>
  );
}

export default function About() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-5 pt-36 sm:px-8">

        {/* About Heading */}
        <h1 className="font-display text-5xl font-light uppercase tracking-[0.1em] text-ink sm:text-6xl">
          About the artist
        </h1>

        {/* Artist Introduction */}
        <motion.section
          {...reveal}
          className="mt-8 grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14"
        >

          {/* Artist Description */}
          <div>
            <p className="max-w-2xl text-xl leading-relaxed text-ink/80">
              {ABOUT.artist}
            </p>
          </div>

          {/* Artist Photo */}
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-sm overflow-hidden rounded-sm bg-cream shadow-lg">
              <img
                src="/images/artist.jpeg"
                alt="Artist portrait"
                className="aspect-[4/5] w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

        </motion.section>

        {/* Artist Journey */}
        <motion.section
          {...reveal}
          className="mt-20"
          aria-labelledby="journey"
        >
          <h2 id="journey" className="section-title">
            Artist journey
          </h2>

          <ol className="relative mt-10">

            <span
              aria-hidden="true"
              className="absolute bottom-3 left-[7px] top-3 w-px bg-gradient-to-b from-accent/60 via-sand to-transparent"
            />

            {ABOUT.journey.map((step, i) => (
              <motion.li
                key={step.title}
                className="relative pb-10 pl-10 last:pb-0"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: 0.05 }}
              >

                <span
                  aria-hidden="true"
                  className="absolute left-0 top-2 h-[15px] w-[15px] rounded-full border border-accent bg-paper"
                />

                <h3 className="font-display text-2xl text-ink">
                  {step.title}
                </h3>

                <p className="mt-2 max-w-prose leading-relaxed text-ink/65">
                  {step.text}
                </p>

              </motion.li>
            ))}

          </ol>
        </motion.section>

        {/* Artistic Style, Inspiration and Mediums */}
        <div className="mt-20">

          <Block title="Artistic style">
            {ABOUT.style}
          </Block>

          <Block title="Inspiration">
            {ABOUT.inspiration}
          </Block>

          <Block title="Mediums & techniques">
            {ABOUT.mediums}
          </Block>

          {/* Personal Message */}
          <motion.section
            {...reveal}
            className="border-t border-ink/10 py-16 text-center"
          >

            <h2 className="section-title">
              Personal message
            </h2>

            <p className="mx-auto mt-8 max-w-2xl font-display text-2xl font-light leading-snug text-ink sm:text-3xl">
              “{ABOUT.message}”
            </p>

          </motion.section>

        </div>

      </div>

      {/* Follow Journey */}
      <FollowJourney className="pt-8" />

    </PageTransition>
  );
}
