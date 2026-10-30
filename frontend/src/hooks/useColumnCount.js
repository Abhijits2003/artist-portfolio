import { useEffect, useState } from 'react';

const calc = () => {
  const w = window.innerWidth;
  return w < 640 ? 1 : w < 1024 ? 2 : w < 1536 ? 3 : 4;
};

export default function useColumnCount(max = 4) {
  const [count, setCount] = useState(calc);
  useEffect(() => {
    let timer;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setCount(calc()), 120);
    };
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, []);
  return Math.min(count, max);
}
