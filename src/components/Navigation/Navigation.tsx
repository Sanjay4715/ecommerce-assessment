"use client";

import { ReactNode } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

interface NavigationProps {
  children: ReactNode;
}

const Navigation: React.FC<NavigationProps> = ({ children }) => {
  return (
    <AuthProvider>
      <CartProvider>
        <Header />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
};

export default Navigation;
