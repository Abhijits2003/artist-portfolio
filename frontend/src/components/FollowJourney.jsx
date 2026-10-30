import SocialLinks from './SocialLinks';

export default function FollowJourney({ className = '' }) {
  return (
    <section className={`mx-auto max-w-3xl px-5 text-center sm:px-8 ${className}`}>
      <h2 className="section-title">Follow the journey</h2>
      <p className="mx-auto mt-4 max-w-md text-ink/60">New work, sketches and stories are shared on these channels.</p>
      <SocialLinks boxed className="mt-8 justify-center" />
    </section>
  );
}
