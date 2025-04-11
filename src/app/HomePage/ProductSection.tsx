"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortByOptions } from "@/constants";
import { Product } from "@/interface/product";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import HomeProductCard from "./HomeProductCard";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductSectionProps {
  categories: string[];
}

const ProductSection: React.FC<ProductSectionProps> = ({ categories }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchProduct, setSearchProduct] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Mock API fetch function - replace with your actual API call
  const fetchProducts = useCallback(
    async (pageNumber: number): Promise<Product[]> => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const url = selectedCategory
          ? sortBy === "Descending"
            ? `/products/category/${selectedCategory}?sort=desc`
            : `/products/category/${selectedCategory}`
          : sortBy === "Descending"
          ? "/products?sort=desc"
          : "/products";

        const response = await api.get(url, { requiresAuth: false });
        if (response.data.length > 0) {
          return response.data;
        } else {
          setHasMore(false);
        }
        setPage(pageNumber);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCategory, sortBy]
  );

  // Initial load and load more function
  const loadProducts = useCallback(async () => {
    if (!hasMore || isLoading) return;

    const newProducts = await fetchProducts(page);
    if (newProducts.length === 0) {
      setHasMore(false);
      return;
    }

    setProducts((prev) => [...prev, ...newProducts]);
    setPage((prev) => prev + 1);
  }, [page, hasMore, isLoading, fetchProducts]);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 500 &&
        !isLoading
      ) {
        setIsLoading(true);
        loadProducts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, loadProducts]);

  // Initial Load
  // Handle filter changes
  useEffect(() => {
    setProducts([]); // Clear existing products
    loadProducts(); // Load new products with current filters
  }, [selectedCategory, sortBy]);

  const handleSearchProduct = (value: string) => {
    setSearchProduct(value);
    const filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(value.toLowerCase())
    );

    if (filteredProducts.length > 0) {
      setFilteredProducts(filteredProducts);
    } else {
      setFilteredProducts([]);
    }
  };

  const handleSelectCategory = (value: string) => setSelectedCategory(value);

  return (
    <div className="space-y-2">
      <div className="flex flex-col md:flex-row  items-start md:items-center space-y-2 space-x-3">
        <p className="text-2xl font-bold">All Products</p>
        <Input
          value={searchProduct}
          onChange={(e) => handleSearchProduct(e.target.value)}
          placeholder="Search Products"
          className="w-full md:w-100 focus-visible:border-[var(--site-primary)] focus-visible:ring-[var(--site-primary)] focus-visible:ring-[1px]"
        />
        <div className="flex space-x-2 ml-0 md:ml-auto">
          <Select
            onValueChange={(value) => {
              setSortBy(value);
            }}
            value={sortBy}
          >
            <SelectTrigger className="w-full focus-visible:border-[var(--site-primary)] focus-visible:ring-[var(--site-primary)] focus-visible:ring-[1px]">
              <SelectValue placeholder="Select Sort by" />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              {sortByOptions.map((sortBy, index) => (
                <SelectItem key={index} value={sortBy}>
                  {sortBy}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handleSelectCategory} value={selectedCategory}>
            <SelectTrigger className="w-full focus-visible:border-[var(--site-primary)] focus-visible:ring-[var(--site-primary)] focus-visible:ring-[1px]">
              <SelectValue placeholder="Filter By Category" />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              {categories.map((category, index) => (
                <SelectItem key={index} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {(selectedCategory || sortBy) && (
        <div className="flex space-x-2 items-center">
          <p>Filter Used: </p>
          {selectedCategory && (
            <div className="flex items-center border-2 rounded-full pl-2 pr-2 space-x-1">
              <p className="text-sm">{selectedCategory}</p>
              <X
                size={15}
                className="cursor-pointer"
                onClick={() => setSelectedCategory("")}
              />
            </div>
          )}
          {sortBy && (
            <div className="flex items-center border-2 rounded-full pl-2 pr-2 space-x-1">
              <p className="text-sm">{sortBy}</p>
              <X
                size={15}
                className="cursor-pointer"
                onClick={() => setSortBy("")}
              />
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(filteredProducts.length > 0 ? filteredProducts : products).map(
          (product, index) => (
            <HomeProductCard key={index} product={product} />
          )
        )}
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[200] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSection;
