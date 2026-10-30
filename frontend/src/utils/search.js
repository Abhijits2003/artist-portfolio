
export const matchesQuery = (artwork, query) => {
  const term = (query || '').trim().toLowerCase();
  if (!term) return true;
  return [artwork.title, artwork.description, artwork.category, artwork.medium, ...(artwork.tags || [])].some(
    (field) => field && String(field).toLowerCase().includes(term)
  );
};
