import styles from "./ColorSwatches.module.scss";

// Small deterministic mapping so swatches look like actual colors, not just
// labels. Falls back to a neutral grey for anything unmapped.
const SWATCH_HEX: Record<string, string> = {
  Black: "#1a1a1a",
  Charcoal: "#3d3d3d",
  Ivory: "#f2ede1",
  Olive: "#5c5f3a",
  Rust: "#a34c2b",
  Navy: "#1f2a44",
};

export function ColorSwatches({
  colors,
  selected,
  onSelect,
}: {
  colors: string[];
  selected: string;
  onSelect: (color: string) => void;
}) {
  return (
    <div className={styles.row} role="radiogroup" aria-label="Color">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          role="radio"
          aria-checked={color === selected}
          className={`${styles.swatch} ${color === selected ? styles.active : ""}`}
          style={{ backgroundColor: SWATCH_HEX[color] ?? "#999" }}
          onClick={() => onSelect(color)}
          title={color}
        >
          <span className="visually-hidden">{color}</span>
        </button>
      ))}
    </div>
  );
}
