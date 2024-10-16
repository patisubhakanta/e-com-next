import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Header from "./components/Header/Header";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

import HomePage from "./pages/home";
import ProductPage from "./pages/product/[id]";
import SignupPage from "./pages/auth/signup";
import Login from "./pages/auth/login";
import ResetPassword from "./pages/auth/reset-password";
import ProfilePage from "./pages/profile";
import Cart from "./pages/cart";
import SuccessPage from "./pages/successpage";
import Wishlist from "./pages/wishlist";


function App() {
  return (
    <Router>
      <CartProvider>
        <WishlistProvider>
        <div className="container">
          <Header />

          <div className="min-h-screen p-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ResetPassword />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/successPage" element={<SuccessPage />} />
              <Route path="/wishlist" element={<Wishlist />} />

            </Routes>
          </div>
        </div>
        </WishlistProvider>
      </CartProvider>
    </Router>
  );
}

export default App;
