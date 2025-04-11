"use client";

import HomeProductCard from "@/app/HomePage/HomeProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import ZoomableImage from "@/components/ZoomableImage/ZoomableImage";
import { Product } from "@/interface/product";
import api from "@/lib/api";
import { AxiosError, AxiosResponse } from "axios";
import { LoaderCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ProductDetails = () => {
  const params = useParams();
  const { productId } = params;
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProductById = async (id: string) => {
    try {
      setIsFetching(true);

      const response: AxiosResponse = await api.get(`/products/${id}`, {
        requiresAuth: true,
      });
      if (response.data.id) {
        setProduct(response.data);

        const products = await api.get(
          `/products/category/${response.data.category}?limit=5`,
          { requiresAuth: false }
        );
        if (products.data.length > 0) {
          setProducts(products.data);
        } else {
          setProducts([]);
        }
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error(`Failed to fetch product details of id ${id}`);
      }
    } finally {
      setIsFetching(false);
    }
  };

  // Find the blog based on the id
  useEffect(() => {
    if (productId?.[0]) {
      fetchProductById(productId[0]);
    }
  }, [productId]);

  if (isFetching) {
    return (
      <div className="min-h-[90vh] pl-5 pr-5 sm:pl-40 sm:pr-40 pt-5 pb-5 flex flex-col justify-center items-center">
        <LoaderCircle className="animate-spin-slow" />
        <div>Fetching Product...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] pl-5 pr-5 sm:pl-40 sm:pr-40 pt-5 pb-5 space-y-5">
      {product && (
        <div className="flex space-x-10">
          <div>
            <ZoomableImage src={product.image} alt={product.title} />
          </div>
          <div className="flex flex-col space-y-2">
            <div className="space-x-3">
              <div className="text-3xl font-bold">{product.title}</div>
              <Badge variant={"outline"}>{product.category}</Badge>
              <div className="flex items-center space-x-2">
                <Rating value={product.rating.rate} />
                <div>({product.rating.count})</div>
              </div>
            </div>
            <b>${product.price}</b>
            <Button className="w-fit">Add To Cart</Button>
            <div>{product.description}</div>
          </div>
        </div>
      )}
      {products.length > 0 && (
        <>
          <div className="font-bold text-lg">
            From same category {product?.category}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <HomeProductCard key={index} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetails;
