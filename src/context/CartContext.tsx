"use client";
import { Product } from "@/interface/product";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type CartContextType = {
  products: Product[];
  productCount: number; // Add productCount to context
  clearCart: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  productExistsOnCart: (id: string) => {
    productInCart: Product;
    status: boolean;
  };
  getProductsInCart: () => Product[];
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [productCount, setProductCount] = useState<number>(0); // Add productCount state

  // Update productCount whenever products change
  useEffect(() => {
    getCartFromLocalStorage();
  }, []);

  const getCartFromLocalStorage = (): Product[] => {
    const stringifiedProducts = localStorage.getItem("cartProducts");
    if (stringifiedProducts && stringifiedProducts.length > 0) {
      const parsedData = JSON.parse(stringifiedProducts);
      setProducts(parsedData);
      setProductCount(parsedData.length);
      return stringifiedProducts ? JSON.parse(stringifiedProducts) : [];
    }
    return [];
  };

  const updateLocalStorage = (cartProducts: Product[]) => {
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
    setProducts(cartProducts); // This will trigger the useEffect above
    setProductCount(cartProducts.length);
  };

  const clearCart = async () => {
    try {
      if (user) {
        await api.delete(`/carts/${user?.sub}`, { requiresAuth: false });
      }
      updateLocalStorage([]);
      toast.success("Cart Cleared Successfully.");
    } catch (error: unknown) {
      let errorMessage = "Failed while clearing cart";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      console.error("Clearing Cart:", error);
    }
  };

  const addToCart = async (product: Product) => {
    if (!user) {
      toast.error("Please login to add the product to cart");
      router.push("/login");
      return;
    }

    try {
      const stringifiedProducts = localStorage.getItem("cartProducts");
      const cartProducts = JSON.parse(stringifiedProducts ?? "");
      if (cartProducts) {
        const productIndex = cartProducts.findIndex(
          (item: Product) => item.id.toString() === product.id.toString()
        );

        if (productIndex !== -1) {
          if (product.quantity) {
            cartProducts[productIndex].quantity += product.quantity;
          }
          toast.success(
            `Product ${product.title} quantity increased by ${product.quantity}`
          );
        } else {
          cartProducts.push(product);
          toast.success(
            `Product ${product.title} added to cart with quantity ${product.quantity}`
          );
        }

        updateLocalStorage(cartProducts);
      }
    } catch (error: unknown) {
      let errorMessage = "Failed to add product to cart";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      console.error("Add to cart error:", error);
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      const cartProducts = getCartFromLocalStorage();
      const updatedCart = cartProducts.filter(
        (item) => item.id.toString() !== id.toString()
      );
      updateLocalStorage(updatedCart);
      toast.success("Product removed from cart.");
    } catch (error: unknown) {
      let errorMessage = "Failed to remove product from cart";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      console.error("Remove from cart error:", error);
    }
  };

  const productExistsOnCart = (id: string) => {
    const stringifiedProducts = localStorage.getItem("cartProducts");
    const cartProducts = JSON.parse(stringifiedProducts ?? "");
    // Find the index of the product in the cart
    const productInCart = cartProducts.find(
      (item: Product) => item.id.toString() === id.toString()
    );
    const productIndex = cartProducts.findIndex(
      (item: Product) => item.id.toString() === id.toString()
    );
    if (productIndex !== -1) {
      return { productInCart, status: true };
    } else {
      return { productInCart: null, status: false };
    }
  };

  const getProductsInCart = () => {
    const stringifiedProducts = localStorage.getItem("cartProducts");
    const cartProducts = JSON.parse(stringifiedProducts ?? "");
    return cartProducts;
  };

  return (
    <CartContext.Provider
      value={{
        products,
        productCount, // Include productCount in context value
        addToCart,
        clearCart,
        removeFromCart,
        productExistsOnCart,
        getProductsInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
