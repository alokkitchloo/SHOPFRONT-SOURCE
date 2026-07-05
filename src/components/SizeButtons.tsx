import { Variant } from "../types";
import styles from "./SizeButtons.module.scss";

export function SizeButtons({
  sizes,
  selected,
  onSelect,
  variantsForColor,
}: {
  sizes: string[];
  selected: string;
  onSelect: (size: string) => void;
  variantsForColor: Variant[];
}) {
  return (
    <div className={styles.row} role="radiogroup" aria-label="Size">
      {sizes.map((size) => {
        const variant = variantsForColor.find((v) => v.size === size);
        const soldOut = !variant || variant.stockLevel === "sold-out";
        const low = variant?.stockLevel === "low-stock";
        return (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={size === selected}
            disabled={soldOut}
            className={`${styles.sizeBtn} ${size === selected ? styles.active : ""} ${
              soldOut ? styles.soldOut : ""
            } ${low ? styles.low : ""}`}
            onClick={() => onSelect(size)}
            title={soldOut ? `${size} — sold out` : low ? `${size} — ${variant?.stock} left` : size}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
