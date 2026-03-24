import type { PropsWithChildren } from 'react'; 
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LiveAnnouncer from './a11y/LiveAnnouncer';
import { useAnnouncer } from '../hooks/useAnnouncer';

/**
 * Envuelve <Routes>:
 * - Mueve el foco a <main id="main"> tras cada navegación (patrón recomendado).
 * - Anuncia el título actual a través de la región aria-live (polite).
 */
export default function RoutesWithAnnouncements({ children }: PropsWithChildren) {
  const { pathname } = useLocation();
  const { polite, assertive, announce } = useAnnouncer();

  useEffect(() => {
    // 1) Mover foco al contenido principal
    const main = document.getElementById('main') as HTMLElement | null;
    if (main) main.focus();

    // 2) Anunciar el cambio; pequeño timeout por si la página cambia document.title en su propio useEffect
    const t = setTimeout(() => {
      announce(`Página: ${document.title || window.location.pathname}`);
    }, 0);

    return () => clearTimeout(t);
  }, [pathname, announce]);

  return (
    <>
      <LiveAnnouncer polite={polite} assertive={assertive} />
      {children}
    </>
  );
}