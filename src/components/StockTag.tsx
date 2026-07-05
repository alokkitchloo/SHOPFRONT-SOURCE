import { StockLevel } from "../types";
import styles from "./StockTag.module.scss";

const COPY: Record<StockLevel, string> = {
  "in-stock": "In stock",
  "low-stock": "Low stock",
  "sold-out": "Sold out",
};

export function StockTag({ level, count }: { level: StockLevel; count?: number }) {
  const label = level === "low-stock" && count != null ? `${count} left` : COPY[level];
  return (
    <span className={`${styles.tag} ${styles[level]} mono`}>
      <span className={styles.dot} />
      {label}
    </span>
  );
}
