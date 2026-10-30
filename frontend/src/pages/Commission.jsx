import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiFeather, FiMap, FiUser, FiPenTool, FiStar } from 'react-icons/fi';
import PageTransition from '../components/PageTransition';
import { sendCommission, errorMessage } from '../api/client';
import { SERVICES, STARTING_PRICE, STYLES } from '../config/site';

const ICONS = { leaf: FiFeather, map: FiMap, user: FiUser, pen: FiPenTool, star: FiStar };
const EMPTY = { name: '', email: '', artworkType: '', style: '', budget: '', deadline: '', message: '', referenceImage: '' };

export default function Commission() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); 
  const [error, setError] = useState('');
  const formRef = useRef(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const choose = (type) => {
    setForm((f) => ({ ...f, artworkType: type }));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.artworkType || !form.message.trim()) {
      setError('Please fill in your name, email, artwork type and message.');
      return;
    }
    setStatus('sending');
    try {
      await sendCommission(form);
      setStatus('sent');
      setForm(EMPTY);
    } catch (err) {
      setError(errorMessage(err));
      setStatus('idle');
    }
  };

  return (
    <PageTransition className="mx-auto max-w-6xl px-5 pb-8 pt-36 sm:px-8">
      <h1 className="font-display text-5xl font-light uppercase tracking-[0.1em] text-ink sm:text-6xl">Commission a drawing</h1>
      <p className="mt-6 max-w-xl text-xl text-ink/75">Have an idea you'd like to turn into art?</p>

      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => {
          const Icon = ICONS[s.icon] || FiStar;
          return (
            <li key={s.key} className="flex flex-col rounded-2xl border border-ink/10 bg-cream p-7">
              <Icon className="text-2xl text-accent" aria-hidden="true" />
              <h2 className="mt-5 text-2xl text-ink">{s.title}</h2>
              <p className="mt-3 flex-1 leading-relaxed text-ink/65">{s.description}</p>
              <p className="mt-5 text-sm text-leaf">{STARTING_PRICE}</p>
              <button onClick={() => choose(s.type)} className="btn btn-ghost mt-5 self-start">Request this</button>
            </li>
          );
        })}
      </ul>

      <section ref={formRef} className="mx-auto mt-24 max-w-2xl scroll-mt-28" aria-labelledby="request">
        <h2 id="request" className="section-title">Tell me your idea</h2>
        <AnimatePresence mode="wait">
          {status === 'sent' ? (
            <motion.div
              key="sent"
              role="status"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-2xl border border-accent/40 bg-cream p-10 text-center"
            >
              <p className="font-display text-3xl text-ink">Your commission request has been received.</p>
              <p className="mt-4 text-ink/70">I'll get back to you soon.</p>
              <button onClick={() => setStatus('idle')} className="btn btn-ghost mt-8">Send another request</button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} noValidate className="mt-8 grid gap-6 sm:grid-cols-2" exit={{ opacity: 0 }}>
              <div>
                <label htmlFor="c-name" className="label">Name</label>
                <input id="c-name" className="field" value={form.name} onChange={set('name')} autoComplete="name" required />
              </div>
              <div>
                <label htmlFor="c-email" className="label">Email</label>
                <input id="c-email" type="email" className="field" value={form.email} onChange={set('email')} autoComplete="email" required />
              </div>
              <div>
                <label htmlFor="c-type" className="label">Artwork type</label>
                <select id="c-type" className="field" value={form.artworkType} onChange={set('artworkType')} required>
                  <option value="">Choose a type</option>
                  {SERVICES.map((s) => <option key={s.key} value={s.type}>{s.title}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="c-style" className="label">Preferred style</label>
                <select id="c-style" className="field" value={form.style} onChange={set('style')}>
                  <option value="">No preference</option>
                  {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="c-budget" className="label">Budget (optional)</label>
                <input id="c-budget" className="field" value={form.budget} onChange={set('budget')} placeholder="For example, ₹5,000" />
              </div>
              <div>
                <label htmlFor="c-deadline" className="label">Deadline (optional)</label>
                <input id="c-deadline" type="date" className="field" value={form.deadline} onChange={set('deadline')} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="c-message" className="label">Message</label>
                <textarea id="c-message" rows={6} className="field resize-y" value={form.message} onChange={set('message')} placeholder="Describe your idea: the subject, the mood, the size, anything that matters." required />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="c-ref" className="label">Reference image link (optional)</label>
                <input id="c-ref" type="url" className="field" value={form.referenceImage} onChange={set('referenceImage')} placeholder="https://" />
                <p className="mt-2 text-xs text-ink/60">No upload needed. Describe your idea above, or paste a link to a reference image.</p>
              </div>
              {error && <p role="alert" className="text-sm text-accent sm:col-span-2">{error}</p>}
              <div className="sm:col-span-2">
                <button type="submit" disabled={status === 'sending'} className="btn btn-solid disabled:opacity-60">
                  {status === 'sending' ? 'Sending' : 'Send commission request'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </section>
    </PageTransition>
  );
}
