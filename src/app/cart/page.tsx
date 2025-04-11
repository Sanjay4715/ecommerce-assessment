"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { IoCartOutline } from "react-icons/io5";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import CartProductCard from "./CartProductCard";
import { AiFillDelete } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Product } from "@/interface/product";
import { useCart } from "@/context/CartContext";
import { Skeleton } from "@/components/ui/skeleton";
import CustomTooltip from "@/components/CustomTooltip/CustomTooltip";

const Cart = () => {
  const { clearCart, products } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [cartProducts, setCartProducts] = useState<Product[]>([]);

  const calculateTotal = () => {
    return cartProducts.reduce((acc, item) => {
      let subTotal = 0;
      if (item.quantity) {
        subTotal = item.price * item.quantity;
      }
      acc += subTotal;
      return acc;
    }, 0);
  };

  const fetchCartDetails = async () => {
    if (products.length > 0) {
      setIsEmpty(false);
      setCartProducts(products);
    } else {
      setIsEmpty(true);
      setCartProducts([]);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchCartDetails();
    setIsLoading(false);
  }, [products]);

  return (
    <div className="min-h-[90vh] pl-5 pr-5 sm:pl-20 sm:pr-20 pt-5 pb-5 space-y-2">
      <div className="text-2xl font-bold flex items-center">
        <p>Shopping Cart</p>
        {cartProducts.length > 0 && (
          <CustomTooltip
            triggerContent={
              <AiFillDelete className="cursor-pointer" onClick={clearCart} />
            }
            message={"Clear Cart"}
          />
        )}
      </div>
      {isEmpty ? (
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="flex flex-col space-y-5 items-center justify-center">
            <IoCartOutline
              size={200}
              className="text-[var(--site-primary)] dark:text-white"
            />
            <div className="text-3xl text-center">
              There is no item in the cart. Let&apos;s go for some shopping.
            </div>
            <Button
              className="w-fit cursor-pointer bg-[var(--site-primary)] dark:bg-white"
              onClick={() => router.push("/")}
            >
              Go For Shopping
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:space-x-5 space-y-5 md:space-y-0">
          <div className="w-full md:w-[75%] space-y-2 order-2 md:order-1">
            <Card className="gap-0">
              <CardHeader className="flex items-center space-x-3 gap-0 font-bold">
                <div className="w-[20%] flex justify-center">Image</div>
                <div className="w-[50%] space-y-2">Product Title</div>
                <div className="w-[10%] flex justify-center">Price</div>
                <div className="w-[20%] flex justify-center">Quantity</div>
                <div className="w-[20%] flex justify-center">Sub Total</div>
              </CardHeader>
            </Card>
            {isLoading && (
              <Card className="gap-0">
                <CardHeader className="flex items-center space-x-3 gap-0 font-bold">
                  <Skeleton className="h-20 w-20 rounded-xl" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
              </Card>
            )}
            {cartProducts.map((product, index) => (
              <CartProductCard key={index} product={product} />
            ))}
          </div>
          <Card className="w-full md:w-[30%] h-fit order-1 md:order-2">
            <CardHeader className="space-y-5">
              <CardTitle>Order Summary</CardTitle>
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                  <div className="flex items-center">
                    <div className="cursor-pointer">
                      {isOpen ? (
                        <MinusIcon size={15} />
                      ) : (
                        <PlusIcon size={15} />
                      )}
                    </div>
                    <div className="flex items-center">Order Total:</div>
                    <div className="ml-auto">${calculateTotal()}</div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                  <ol>
                    {cartProducts.map((product, index) => (
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
      )}
    </div>
  );
};

export default Cart;
