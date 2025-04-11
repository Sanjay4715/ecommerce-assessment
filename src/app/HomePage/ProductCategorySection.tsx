"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import ProductSection from "./ProductSection";
import { useEffect, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import api from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const ProductCategorySection = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [categories, setCategories] = useState<string[]>([]);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse = await api.get("/products/categories", {
        requiresAuth: false, // Move requiresAuth to the config root
      });
      if (response.data.length > 0) {
        setIsEmpty(false);
        setCategories(response.data);
      } else {
        setIsEmpty(true);
        setCategories([]);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error("failed while fetching categories");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <>
      <div className="space-y-2 hidden sm:block">
        <p className="text-2xl font-bold">Categories</p>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : isEmpty ? (
          <div className="flex items-center">
            There is no any categories at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {categories.map((category, index) => (
              <Card key={index} className="pt-2 pb-2">
                <CardHeader className="text-center">
                  <CardTitle>{category}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Product Section */}
      <ProductSection categories={categories} />
    </>
  );
};

export default ProductCategorySection;
