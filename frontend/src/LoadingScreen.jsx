export default function LoadingScreen({ message = 'Getting your page ready', compact = false }) {
  return (
    <section
      className={`loading-screen${compact ? ' loading-screen-compact' : ''}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="loading-card">
        <div className="loading-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="eyebrow">Nius We Care</p>
        <h1>{message}</h1>
        <p className="loading-copy">Gathering the details for you…</p>
        <div className="loading-progress" aria-hidden="true"><span /></div>
        {!compact && (
          <div className="loading-skeleton" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>
    </section>
  )
}
