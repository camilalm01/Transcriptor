import { useCallback, useState } from 'react';

export function useAnnouncer() {
  const [polite, setPolite] = useState('');
  const [assertive, setAssertive] = useState('');

  const announce = useCallback((msg: string, opts?: { assertive?: boolean }) => {
    if (opts?.assertive) setAssertive(msg);
    else setPolite(msg);

    // Limpia el texto para evitar repeticiones en remounts.
    window.setTimeout(() => {
      setPolite('');
      setAssertive('');
    }, 1000);
  }, []);

  return { polite, assertive, announce };
}
