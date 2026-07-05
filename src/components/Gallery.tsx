import { useState } from "react";
import styles from "./Gallery.module.scss";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImage}>
        <img src={images[activeIndex]} alt={alt} />
      </div>
      <div className={styles.thumbnails}>
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.thumb} ${i === activeIndex ? styles.active : ""}`}
            onClick={() => setActiveIndex(i)}
            aria-label={`Show image ${i + 1} of ${images.length}`}
            aria-current={i === activeIndex}
          >
            <img src={src} alt="" aria-hidden />
          </button>
        ))}
      </div>
    </div>
  );
}
