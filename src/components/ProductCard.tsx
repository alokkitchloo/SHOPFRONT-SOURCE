import { Link } from "react-router-dom";
import { Product } from "../types";
import { useAddToCart } from "../hooks/useAddToCart";
import styles from "./ProductCard.module.scss";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, status } = useAddToCart();

  // Quick-add uses the first in-stock variant found; if the whole product is
  // sold out across every variant, the quick-add button is disabled and the
  // shopper is directed to the detail page to see options.
  const firstAvailable = product.variants.find((v) => v.stockLevel !== "sold-out");

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (!firstAvailable) return;
    addToCart({
      productId: product.id,
      title: product.title,
      image: product.images[0],
      color: firstAvailable.color,
      size: firstAvailable.size,
      unitPrice: product.price,
      quantity: 1,
      maxStock: firstAvailable.stock,
    });
  }

  return (
    <article className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.imageLink}>
        <img src={product.images[0]} alt={product.title} className={styles.image} loading="lazy" />
      </Link>
      <div className={styles.body}>
        <p className={styles.brand}>{product.brand}</p>
        <Link to={`/product/${product.id}`} className={styles.title}>
          {product.title}
        </Link>
        <div className={styles.priceRow}>
          <span className={`${styles.price} mono`}>${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className={`${styles.originalPrice} mono`}>${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
      <button
        type="button"
        className={styles.quickAdd}
        onClick={handleQuickAdd}
        disabled={!firstAvailable || status === "loading"}
      >
        {!firstAvailable ? "Sold out" : status === "loading" ? "Adding…" : "Quick add"}
      </button>
    </article>
  );
}
