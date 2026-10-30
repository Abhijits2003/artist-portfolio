export function Loading({ label = 'Loading' }) {
  return (
    <div role="status" className="flex flex-col items-center gap-4 py-24 text-ink/60">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-ink/20 border-t-accent" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="mx-auto max-w-md py-24 text-center">
      <p className="text-ink/80">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-ghost mt-6">
          Try again
        </button>
      )}
    </div>
  );
}

export function Empty({ title, children }) {
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <div className="mt-4 text-ink/60">{children}</div>
    </div>
  );
}
