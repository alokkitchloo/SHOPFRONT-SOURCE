import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { CartDrawer } from "./components/CartDrawer";
import { ProductListingPage } from "./pages/ProductListingPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";

export function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductListingPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="*" element={<ProductListingPage />} />
      </Routes>
      <CartDrawer />
    </>
  );
}
