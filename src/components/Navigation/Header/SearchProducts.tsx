"use client";

import { Input } from "@/components/ui/input";
import { Product } from "@/interface/product";
import api from "@/lib/api";
import { LoaderCircle, Search, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SearchProducts = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchProductsWithSearchParams = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<Product[]>(`/products`, {
        requiresAuth: false,
        params: {
          q: searchText.toLowerCase(),
        },
      });

      const filteredProducts = response.data.filter((item: Product) =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error searching products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!searchText.trim()) {
      setProducts([]);
      return;
    }

    debounceTimer.current = setTimeout(fetchProductsWithSearchParams, 500); // Run only after 500ms of inactivity

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchText]);

  const handleSearchText = (value: string) => {
    setIsLoading(true);
    setSearchText(value);
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer">
        <Search className="h-4 w-4" />
      </div>
      <Input
        placeholder="Search Products"
        value={searchText}
        onChange={(e) => handleSearchText(e.target.value)}
        className="focus-visible:border-[var(--site-primary)] focus-visible:ring-[var(--site-primary)] focus-visible:ring-[1px] pl-10"
      />
      {searchText && !isLoading && (
        <div className="absolute right-3 top-2 text-xs">
          <SearchX
            onClick={() => setSearchText("")}
            className="cursor-pointer"
          />
        </div>
      )}
      {isLoading && (
        <div className="absolute right-3 top-2 text-xs">
          <LoaderCircle className="animate-spin-slow" />
        </div>
      )}
      {products.length > 0 ? (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md max-h-60 overflow-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                router.push(`/product/${product.id}`);
                setSearchText("");
              }}
            >
              {product.title}
            </div>
          ))}
        </div>
      ) : isLoading ? (
        <div>
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md flex justify-center p-2">
            Searching...
          </div>
        </div>
      ) : (
        searchText && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md flex justify-center p-2">
            Product Not Found
          </div>
        )
      )}
    </div>
  );
};

export default SearchProducts;
