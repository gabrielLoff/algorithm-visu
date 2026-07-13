import { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { getVisualizers } from './visualizers';

function useHash(): string {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return hash;
}

export default function App() {
  const hash = useHash();

  for (const v of getVisualizers()) {
    if (hash === `#/${v.hash}`) {
      return <v.component />;
    }
  }

  return <HomePage />;
}
