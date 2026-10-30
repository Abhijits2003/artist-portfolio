import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

export default function NotFound() {
  return (
    <PageTransition className="mx-auto max-w-md px-5 pb-16 pt-48 text-center">
      <h1 className="text-4xl text-ink">This page does not exist</h1>
      <p className="mt-4 text-ink/60">The link may be old or mistyped.</p>
      <Link to="/" className="btn btn-solid mt-8">Go home</Link>
    </PageTransition>
  );
}
