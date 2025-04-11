"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/interface/product";
import Logo from "@/public/Logo.svg";
import Image from "next/image";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const CartProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [src, setSrc] = useState(product.image);
  return (
    <Card className="gap-0">
      <CardHeader className="flex items-center space-x-3 gap-0">
        <Image
          src={src}
          alt={product.title}
          width={100}
          height={100}
          className="object-contain"
          onError={() => setSrc(Logo)}
          quality={100}
        />
        <CardTitle className="w-[50%] space-y-2">
          <div>{product.title}</div>
          <Badge variant="outline">{product.category}</Badge>
        </CardTitle>
        <CardTitle className="w-[20%] flex justify-center">
          ${product.price}
        </CardTitle>
        <CardTitle className="w-[20%] flex justify-center">1</CardTitle>
        <CardTitle className="w-[20%] flex justify-center">
          ${product.price * 1}
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default CartProductCard;
