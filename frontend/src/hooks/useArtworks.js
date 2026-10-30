import { useCallback, useEffect, useState } from 'react';
import { getArtworks, errorMessage } from '../api/client';

export default function useArtworks() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    getArtworks()
      .then((data) => setArtworks(Array.isArray(data) ? data : []))
      .catch((e) => setError(errorMessage(e, 'Could not load the artwork.')))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  return { artworks, loading, error, reload: load };
}
