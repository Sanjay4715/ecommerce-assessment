"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/interface/product";
import Logo from "@/public/Logo.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AiFillDelete } from "react-icons/ai";
import CustomTooltip from "@/components/CustomTooltip/CustomTooltip";
import { useCart } from "@/context/CartContext";
interface ProductCardProps {
  product: Product;
}

const CartProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { removeFromCart } = useCart();
  const router = useRouter();
  const [src, setSrc] = useState(product.image);

  useEffect(() => {
    setSrc(product.image);
  }, [product]);

  return (
    <Card className="gap-0 pr-0">
      <CardHeader className="flex items-center space-x-3 gap-0">
        <Image
          src={src}
          alt={product.title}
          width={100}
          height={100}
          className="object-contain w-auto h-auto"
          onError={() => setSrc(Logo)}
          quality={100}
          priority
        />
        <CardTitle className="w-[50%] space-y-2">
          <div
            className="cursor-pointer hover:underline"
            onClick={() => router.push(`/product/${product.id}`)}
          >
            {product.title}
          </div>
          <Badge variant="outline">{product.category}</Badge>
        </CardTitle>
        <CardTitle className="w-[20%] flex justify-center">
          ${product.price}
        </CardTitle>
        <CardTitle className="w-[20%] flex justify-center">
          {product?.quantity}
        </CardTitle>
        {product?.quantity && (
          <CardTitle className="w-[20%] flex justify-center">
            ${product.price * product?.quantity}
          </CardTitle>
        )}
        <CustomTooltip
          triggerContent={
            <AiFillDelete
              size={20}
              className="cursor-pointer"
              onClick={() => removeFromCart(product.id)}
            />
          }
          message={"Remove Product from cart"}
        />
      </CardHeader>
    </Card>
  );
};

export default CartProductCard;
