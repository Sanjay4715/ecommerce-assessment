"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

interface CardProps {
  product: Product;
}

const HomeProductCard: React.FC<CardProps> = ({ product }) => {
  const router = useRouter();
  const [imageSrc, setImageSrc] = useState<string>(product.image);

  useEffect(() => {
    if (product.image) {
      setImageSrc(product.image);
    } else {
      setImageSrc(Logo);
    }
  }, [product]);

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
        <CardTitle
          className="cursor-pointer hover:underline"
          onClick={() => router.push(`/product/${product.id}`)}
        >
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
      <CardFooter className="mt-auto">
        <Button>Add To Cart</Button>
      </CardFooter>
    </Card>
  );
};

export default HomeProductCard;
