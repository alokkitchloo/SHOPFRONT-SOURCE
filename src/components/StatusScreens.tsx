import styles from "./StatusScreens.module.scss";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className={styles.status} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden />
      <p className="mono">{label}</p>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className={styles.status} role="alert">
      <p className={styles.errorTitle}>Something went wrong</p>
      <p className={styles.errorMessage}>{message}</p>
      {onRetry && (
        <button type="button" className={styles.retryButton} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
