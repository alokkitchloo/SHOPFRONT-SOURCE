import { useCart } from "../context/CartContext";
import styles from "./CartDrawer.module.scss";

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, subtotal, removeItem, setQuantity } = useCart();

  return (
    <>
      <div
        className={`${styles.overlay} ${isDrawerOpen ? styles.visible : ""}`}
        onClick={closeDrawer}
        aria-hidden={!isDrawerOpen}
      />
      <aside
        className={`${styles.drawer} ${isDrawerOpen ? styles.open : ""}`}
        role="dialog"
        aria-label="Shopping cart"
        aria-hidden={!isDrawerOpen}
      >
        <header className={styles.header}>
          <h2 className={styles.heading}>Your cart</h2>
          <button type="button" className={styles.closeBtn} onClick={closeDrawer} aria-label="Close cart">
            ×
          </button>
        </header>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>Your cart is empty.</p>
            <p className={styles.emptyHint}>Add something from the catalog to see it here.</p>
          </div>
        ) : (
          <>
            <ul className={styles.list}>
              {items.map((item) => (
                <li key={`${item.productId}-${item.color}-${item.size}`} className={styles.line}>
                  <img src={item.image} alt={item.title} className={styles.thumb} />
                  <div className={styles.lineBody}>
                    <p className={styles.lineTitle}>{item.title}</p>
                    <p className={styles.lineVariant}>
                      {item.color} / {item.size}
                    </p>
                    <div className={styles.lineFooter}>
                      <div className={styles.qtyPicker}>
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.title}`}
                          onClick={() => setQuantity(item.productId, item.color, item.size, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="mono">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.title}`}
                          onClick={() => setQuantity(item.productId, item.color, item.size, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                        >
                          +
                        </button>
                      </div>
                      <span className={`${styles.lineTotal} mono`}>
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.remove}
                    onClick={() => removeItem(item.productId, item.color, item.size)}
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span className="mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total</span>
                <span className="mono">${subtotal.toFixed(2)}</span>
              </div>
              <button type="button" className={styles.checkoutBtn}>
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
