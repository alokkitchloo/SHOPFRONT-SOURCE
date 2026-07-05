import styles from "./QuantityPicker.module.scss";

export function QuantityPicker({
  quantity,
  max,
  onChange,
}: {
  quantity: number;
  max: number;
  onChange: (next: number) => void;
}) {
  const clamp = (n: number) => Math.max(1, Math.min(n, Math.max(max, 1)));

  return (
    <div className={styles.picker}>
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(clamp(quantity - 1))}
        disabled={quantity <= 1}
      >
        −
      </button>
      <span className={`${styles.value} mono`} aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(clamp(quantity + 1))}
        disabled={quantity >= max}
      >
        +
      </button>
    </div>
  );
}
