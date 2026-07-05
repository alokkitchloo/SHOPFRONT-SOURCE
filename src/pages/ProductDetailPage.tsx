import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useAddToCart } from "../hooks/useAddToCart";
import { findVariant } from "../data/deriveProduct";
import { Gallery } from "../components/Gallery";
import { ColorSwatches } from "../components/ColorSwatches";
import { SizeButtons } from "../components/SizeButtons";
import { QuantityPicker } from "../components/QuantityPicker";
import { StockTag } from "../components/StockTag";
import { LoadingState, ErrorState } from "../components/StatusScreens";
import styles from "./ProductDetailPage.module.scss";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { product, status, error } = useProduct(id);
  const [searchParams, setSearchParams] = useSearchParams();
  const [quantity, setQuantity] = useState(1);
  const { addToCart, status: addStatus, errorMessage } = useAddToCart();

  const urlColor = searchParams.get("color");
  const urlSize = searchParams.get("size");

  // Default the URL to the first color/size once the product loads, so the
  // page is always deep-linkable even from a bare /product/:id link.
  useEffect(() => {
    if (!product) return;
    if (!urlColor || !urlSize) {
      setSearchParams(
        { color: urlColor ?? product.colors[0], size: urlSize ?? product.sizes[0] },
        { replace: true }
      );
    }
  }, [product, urlColor, urlSize, setSearchParams]);

  if (status === "loading") return <LoadingState label="Loading product…" />;
  if (status === "not-found") {
    return (
      <div className={styles.notFound}>
        <p>We couldn't find that product.</p>
        <Link to="/">Back to catalog</Link>
      </div>
    );
  }
  if (status === "error" || !product) {
    return <ErrorState message={error ?? "Couldn't load this product."} />;
  }

  // Rebind to a new const so TypeScript's narrowing holds inside the closures
  // below (handleAddToCart etc.) across re-renders.
  const p = product;

  const color = urlColor ?? p.colors[0];
  const size = urlSize ?? p.sizes[0];
  const variant = findVariant(p, color, size);
  const variantsForColor = p.variants.filter((v) => v.color === color);
  const soldOut = !variant || variant.stockLevel === "sold-out";

  function selectColor(nextColor: string) {
    setSearchParams({ color: nextColor, size }, { replace: false });
    setQuantity(1);
  }
  function selectSize(nextSize: string) {
    setSearchParams({ color, size: nextSize }, { replace: false });
    setQuantity(1);
  }

  function handleAddToCart() {
    if (!variant || soldOut) return;
    addToCart({
      productId: p.id,
      title: p.title,
      image: p.images[0],
      color,
      size,
      unitPrice: p.price,
      quantity,
      maxStock: variant.stock,
    });
  }

  return (
    <main className={styles.page}>
      <Link to="/" className={styles.back}>
        ← Back to catalog
      </Link>
      <div className={styles.layout}>
        <Gallery images={p.images} alt={p.title} />

        <div className={styles.details}>
          <p className={styles.brand}>{p.brand}</p>
          <h1 className={styles.title}>{p.title}</h1>

          <div className={styles.priceRow}>
            <span className={`${styles.price} mono`}>${p.price.toFixed(2)}</span>
            {p.originalPrice && (
              <span className={`${styles.originalPrice} mono`}>${p.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <section className={styles.section}>
            <p className={styles.sectionLabel}>Color — {color}</p>
            <ColorSwatches colors={p.colors} selected={color} onSelect={selectColor} />
          </section>

          <section className={styles.section}>
            <div className={styles.sizeHeader}>
              <p className={styles.sectionLabel}>Size — {size}</p>
              {variant && <StockTag level={variant.stockLevel} count={variant.stock} />}
            </div>
            <SizeButtons
              sizes={p.sizes}
              selected={size}
              onSelect={selectSize}
              variantsForColor={variantsForColor}
            />
          </section>

          <section className={styles.section}>
            <p className={styles.sectionLabel}>Quantity</p>
            <QuantityPicker quantity={quantity} max={variant?.stock ?? 1} onChange={setQuantity} />
          </section>

          <button
            type="button"
            className={styles.addToCart}
            onClick={handleAddToCart}
            disabled={soldOut || addStatus === "loading"}
          >
            {soldOut ? "Sold out" : addStatus === "loading" ? "Adding…" : "Add to cart"}
          </button>
          {addStatus === "error" && <p className={styles.addError}>{errorMessage}</p>}

          <p className={styles.description}>{p.description}</p>
        </div>
      </div>
    </main>
  );
}
