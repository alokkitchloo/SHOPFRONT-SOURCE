import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import styles from "./Navbar.module.scss";

export function Navbar() {
  const { itemCount, openDrawer } = useCart();

  return (
    <header className={styles.navbar}>
      <Link to="/" className={styles.wordmark}>
        Shopfront
      </Link>
      <button
        type="button"
        className={styles.cartButton}
        onClick={openDrawer}
        aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="9" cy="21" r="1.4" />
          <circle cx="18" cy="21" r="1.4" />
          <path d="M2.5 3h2.2l2.1 12.2a2 2 0 0 0 2 1.7h8.4a2 2 0 0 0 2-1.6l1.5-7.6H6" />
        </svg>
        {itemCount > 0 && <span className={`${styles.badge} mono`}>{itemCount}</span>}
      </button>
    </header>
  );
}
