// context/CartContext.tsx
"use client"; // Add this directive at the top

import { Product } from "@/interface/product";
import api from "@/lib/api";
import { AxiosError, AxiosResponse } from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

type CartContextType = {
  products: Product[];
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);

  const clearCart = () => {
    setProducts([]);
    localStorage.setItem("cartProducts", "");
  };

  const fetchCartDetails = async (userId: string) => {
    try {
      const response: AxiosResponse = await api.get(`/carts/${userId}`, {
        requiresAuth: false, // Move requiresAuth to the config root
      });
      if (response.data.products.length > 0) {
        const productsInCart = response.data.products;
        const productsMapped = [];
        for (let i = 0; i < productsInCart.length; i++) {
          const product = productsInCart[i];
          const productRes = await api.get(`/products/${product.productId}`, {
            requiresAuth: false,
          });
          productsMapped.push({
            ...productRes.data,
            quantity: product.quantity,
          });
        }
        localStorage.setItem("cartProducts", JSON.stringify(productsMapped));
        setProducts(productsMapped);
      } else {
        setProducts([]);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error("failed while fetching cart details");
      }
    }
  };

  useEffect(() => {
    if (user && user.sub) {
      fetchCartDetails(user?.sub);
    }
  }, [user]);

  return (
    <CartContext.Provider value={{ products, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within an CartProviderr");
  }
  return context;
};
