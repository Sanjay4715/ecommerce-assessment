"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import CartProductCard from "./CartProductCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AxiosError, AxiosResponse } from "axios";
import api from "@/lib/api";
import { toast } from "sonner";
import { Product } from "@/interface/product";

const Cart = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);

  const calculateTotal = () => {
    return products.reduce((acc, item) => {
      let subTotal = 0;
      if (item.quantity) {
        subTotal = item.price * item.quantity;
      }
      acc += subTotal;
      return acc;
    }, 0);
  };

  const fetchCartDetails = async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse = await api.get(`/carts/${user?.sub}`, {
        requiresAuth: false, // Move requiresAuth to the config root
      });
      console.log(response.data);
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
        setProducts(productsMapped);
        setIsEmpty(false);
      } else {
        setIsEmpty(true);
        setProducts([]);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error("failed while fetching cart details");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.sub) {
      fetchCartDetails();
    }
  }, [user]);

  return isEmpty ? (
    <div className="min-h-[90vh] pl-5 pr-5 sm:pl-20 sm:pr-20 pt-5 pb-5"></div>
  ) : (
    <div className="min-h-[90vh] pl-5 pr-5 sm:pl-20 sm:pr-20 pt-5 pb-5 space-y-2">
      <div className="text-2xl font-bold">Shopping Cart</div>
      <div className="flex flex-col md:flex-row md:space-x-5 space-y-5 md:space-y-0">
        <div className="w-full md:w-[70%] space-y-2 order-2 md:order-1">
          <Card className="gap-0">
            <CardHeader className="flex items-center space-x-3 gap-0 font-bold">
              <div className="w-[15%] flex justify-center">Image</div>
              <div className="w-[50%] space-y-2">Product Title</div>
              <div className="w-[20%] flex justify-center">Price</div>
              <div className="w-[20%] flex justify-center">Quantity</div>
              <div className="w-[20%] flex justify-center">Sub Total</div>
            </CardHeader>
          </Card>
          {isLoading && (
            <Card className="gap-0">
              <CardHeader className="flex items-center space-x-3 gap-0 font-bold">
                <div className="w-[15%] flex justify-center">Image</div>
                <div className="w-[50%] space-y-2">Product Title</div>
                <div className="w-[20%] flex justify-center">Price</div>
                <div className="w-[20%] flex justify-center">Quantity</div>
                <div className="w-[20%] flex justify-center">Sub Total</div>
              </CardHeader>
            </Card>
          )}
          {products.map((product, index) => (
            <CartProductCard key={index} product={product} />
          ))}
        </div>
        <Card className="w-full md:w-[30%] h-fit order-1 md:order-2">
          <CardHeader className="space-y-5">
            <CardTitle>Order Summary</CardTitle>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <div className="flex items-center">
                  <div>
                    {isOpen ? <MinusIcon size={15} /> : <PlusIcon size={15} />}
                  </div>
                  <div className="flex items-center">Order Total:</div>
                  <div className="ml-auto">${calculateTotal()}</div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <ol>
                  {products.map((product, index) => (
                    <li key={index} className="flex">
                      <div className="text-sm font-bold">
                        {product.title.slice(0, 30)}... (x{product.quantity})
                      </div>
                      {product.quantity && (
                        <div className="ml-auto">
                          ${product.price * product.quantity}
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              </CollapsibleContent>
            </Collapsible>
            <Button
              className="cursor-pointer"
              onClick={() => router.push("/checkout")}
            >
              Proceed to checkout
            </Button>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
