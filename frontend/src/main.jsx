import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>    
          <App />
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 2200,
              style: {
                background: "#1F2420",
                color: "#F6F4EF",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                borderRadius: "8px",
              },
              success: { iconTheme: { primary: "#1E8A72", secondary: "#F6F4EF" } },
              error: { iconTheme: { primary: "#C4573B", secondary: "#F6F4EF" } },
            }}
          />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
