import { useCallback, useEffect, useState } from 'react';

const EVENT = 'stored-list-change';

const read = (key) => {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};


export default function useStoredList(key) {
  const [list, setList] = useState(() => read(key));

  useEffect(() => {
    const sync = () => setList(read(key));
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, [key]);

  const write = useCallback(
    (next) => {
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* storage unavailable (private mode): ignore */
      }
      setList(next);
      window.dispatchEvent(new Event(EVENT));
    },
    [key]
  );

  const has = useCallback((id) => list.includes(id), [list]);
  const add = useCallback((id) => write([...new Set([...read(key), id])]), [key, write]);
  const remove = useCallback((id) => write(read(key).filter((x) => x !== id)), [key, write]);
  const toggle = useCallback((id) => (read(key).includes(id) ? remove(id) : add(id)), [key, add, remove]);

  return { list, has, add, remove, toggle };
}
