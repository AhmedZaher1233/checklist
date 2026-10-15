interface StatusMessageProps {
  /** Result to announce politely (also used for errors, so screen-reader users hear them once). */
  announcement: string;
  /** Error shown visibly near the list; announced through the live region above. */
  error: string | null;
}

/** Live region for results and a visible error area (architecture/cross-cutting/accessibility.md, rule 4). */
export default function StatusMessage({ announcement, error }: StatusMessageProps) {
  return (
    <>
      <div role="status" aria-live="polite" className="sr-only" data-testid="live-region">
        {announcement}
      </div>
      {error && (
        <p className="error-message" data-testid="error-message">
          {error}
        </p>
      )}
    </>
  );
}
