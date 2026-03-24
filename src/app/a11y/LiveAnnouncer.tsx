/**
 * Componente con las 2 regiones live:
 *  - role="status" (polite, aria-atomic=true)
 *  - role="alert"  (assertive, aria-atomic=true)
 */
export default function LiveAnnouncer({
  polite,
  assertive,
}: {
  polite: string;
  assertive: string;
}) {
  return (
    <>
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {polite}
      </div>
      <div role="alert" aria-live="assertive" aria-atomic="true" className="sr-only">
        {assertive}
      </div>
    </>
  );
}