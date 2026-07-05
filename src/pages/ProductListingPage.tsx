import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/ProductCard";
import { LoadingState, ErrorState } from "../components/StatusScreens";
import styles from "./ProductListingPage.module.scss";

export function ProductListingPage() {
  const { products, status, error } = useProducts();

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Catalog</h1>
      {status === "loading" && <LoadingState label="Loading catalog…" />}
      {status === "error" && (
        <ErrorState message={error ?? "Couldn't load products."} onRetry={() => window.location.reload()} />
      )}
      {status === "success" && (
        <div className={styles.grid}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
