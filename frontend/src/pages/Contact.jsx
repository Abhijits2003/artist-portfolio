import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import SocialLinks from '../components/SocialLinks';
import { sendContact, errorMessage } from '../api/client';
import { SITE } from '../config/site';

const EMPTY = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const showEmail = SITE.email && !SITE.email.startsWith('YOUR_');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in your name, email and message.');
      return;
    }
    setStatus('sending');
    try {
      await sendContact(form);
      setStatus('sent');
      setForm(EMPTY);
    } catch (err) {
      setError(errorMessage(err));
      setStatus('idle');
    }
  };

  return (
    <PageTransition className="mx-auto max-w-5xl px-5 pb-8 pt-36 sm:px-8">
      <h1 className="font-display text-5xl font-light uppercase tracking-[0.1em] text-ink sm:text-6xl">Contact</h1>

      <div className="mt-14 grid gap-16 md:grid-cols-[1.6fr_1fr]">
        <div aria-live="polite">
          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <motion.div key="sent" role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-accent/40 bg-cream p-10">
                <p className="font-display text-3xl text-ink">Message sent.</p>
                <p className="mt-4 text-ink/70">Thank you for writing. I'll reply as soon as I can.</p>
                <button onClick={() => setStatus('idle')} className="btn btn-ghost mt-8">Send another message</button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} noValidate className="grid gap-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="k-name" className="label">Name</label>
                    <input id="k-name" className="field" value={form.name} onChange={set('name')} autoComplete="name" required />
                  </div>
                  <div>
                    <label htmlFor="k-email" className="label">Email</label>
                    <input id="k-email" type="email" className="field" value={form.email} onChange={set('email')} autoComplete="email" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="k-subject" className="label">Subject</label>
                  <input id="k-subject" className="field" value={form.subject} onChange={set('subject')} />
                </div>
                <div>
                  <label htmlFor="k-message" className="label">Message</label>
                  <textarea id="k-message" rows={7} className="field resize-y" value={form.message} onChange={set('message')} required />
                </div>
                {error && <p role="alert" className="text-sm text-accent">{error}</p>}
                <div>
                  <button type="submit" disabled={status === 'sending'} className="btn btn-solid disabled:opacity-60">
                    {status === 'sending' ? 'Sending' : 'Send message'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <aside>
          <h2 className="section-title text-xl">Follow the journey</h2>
          <SocialLinks boxed className="mt-6" />
          {showEmail && (
            <p className="mt-8 text-ink/70">
              Or write directly: <a className="text-accent hover:underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
          )}
        </aside>
      </div>
    </PageTransition>
  );
}
