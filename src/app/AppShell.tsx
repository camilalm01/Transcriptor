import AccessibilityButton from '../components/ui/AccessibilityButton';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div id="app-content">
      <main id="main" role="main" tabIndex={-1}>
        {children}
      </main>

      <footer role="contentinfo">
        <small>© {new Date().getFullYear()} · Transcriptor</small>
      </footer>

      {/* FAB de accesibilidad en todas las pantallas */}
      <AccessibilityButton />
    </div>
  );
}