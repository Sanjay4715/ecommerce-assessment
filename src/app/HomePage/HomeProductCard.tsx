"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import { Product } from "@/interface/product";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/Logo.svg";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import CustomTooltip from "@/components/CustomTooltip/CustomTooltip";
import ShareMenu from "@/components/ShareMenu/ShareMenu";

interface CardProps {
  product: Product;
}

const HomeProductCard: React.FC<CardProps> = ({ product }) => {
  const { addToCart, productExistsOnCart, products } = useCart();
  const router = useRouter();
  const [imageSrc, setImageSrc] = useState<string>(product.image);
  const [inCart, setInCart] = useState<boolean>(false);

  useEffect(() => {
    if (product.image) {
      setImageSrc(product.image);
    } else {
      setImageSrc(Logo);
    }

    checkIfProductExistsOnCart(product.id);
  }, [product, products]);

  const checkIfProductExistsOnCart = async (id: string) => {
    const { status } = await productExistsOnCart(id);
    setInCart(status ?? false);
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      ...product,
      quantity: 1,
    });
  };

  return (
    <Card
      onClick={() => router.push(`/product/${product.id}`)}
      className="border-0 z-1 flex gap-3 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02]"
    >
      <div className="relative aspect-square w-full h-50 overflow-hidden rounded-tl-lg rounded-tr-lg">
        <Image
          src={imageSrc}
          alt={product.title}
          fill
          className="object-contain"
          quality={100}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={true} // ← Add this for LCP images
          onError={() => setImageSrc(Logo)}
        />
      </div>
      <CardHeader>
        <CardTitle className="cursor-pointer hover:underline">
          {product.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardTitle>${product.price}</CardTitle>
        <CardTitle>
          <Rating value={product.rating.rate} />
        </CardTitle>
      </CardContent>
      <CardContent>
        <CardTitle>
          <Badge variant="outline" className="border-[var(--site-primary)]">
            <Link href={`product/category/${product.category}`}>
              {product.category}
            </Link>
          </Badge>
        </CardTitle>
      </CardContent>
      <CardFooter className="mt-auto flex items-center">
        <div
          onClick={(e) => {
            e.stopPropagation(); // prevent bubbling up to the Card
            handleAddToCart(product);
          }}
          className="border-2 px-3 py-1 rounded-2xl bg-[var(--site-primary)] text-white text-sm dark:bg-white dark:text-black"
        >
          {inCart ? (
            <CustomTooltip
              triggerContent="In cart"
              message="Clicking on button would increase the quantity by 1"
            />
          ) : (
            <CustomTooltip
              triggerContent="Add To Cart"
              message="Clicking on button would add the product on cart with 1"
            />
          )}
        </div>
        <ShareMenu title={product.title} className="ml-auto" />
      </CardFooter>
    </Card>
  );
};

export default HomeProductCard;
