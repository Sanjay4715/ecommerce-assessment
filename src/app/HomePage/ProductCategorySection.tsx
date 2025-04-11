"use client";

import ProductSection from "./ProductSection";
import { useEffect, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import api from "@/lib/api";
import { toast } from "sonner";
import { Product } from "@/interface/product";
import HomeProductCard from "./HomeProductCard";

const ProductCategorySection = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [highRatedProducts, setHighRatedProducts] = useState<Product[]>([]);

  const loadCategories = async () => {
    try {
      const response: AxiosResponse = await api.get("/products/categories", {
        requiresAuth: false, // Move requiresAuth to the config root
      });
      if (response.data.length > 0) {
        setCategories(response.data);
      } else {
        setCategories([]);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error("failed while fetching categories");
      }
    }
  };

  const loadProducts = async () => {
    try {
      // Simulate API delay
      const response = await api.get("/products?limit=10", {
        requiresAuth: false,
      });
      if (response.data.length > 0) {
        setHighRatedProducts(
          response.data.sort(
            (a: Product, b: Product) => b.rating.rate - a.rating.rate
          )
        );
        return response.data;
      }
      return [];
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error("failed while fetching products");
      }
    }
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  return (
    <>
      <div className="space-y-2 hidden sm:block">
        <p className="text-2xl font-bold">Highly Rated Products</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {highRatedProducts.slice(0, 4).map((product, index) => (
            <HomeProductCard key={index} product={product} />
          ))}
        </div>
      </div>

      {/* Product Section */}
      <ProductSection categories={categories} />
    </>
  );
};

export default ProductCategorySection;
