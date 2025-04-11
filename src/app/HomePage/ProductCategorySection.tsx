"use client";

import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProductSection from "./ProductSection";

const ProductCategorySection = () => {
  const categories = [
    "electronics",
    "jewelery",
    "men's clothing",
    "women's clothing",
  ];

  return (
    <>
      <div className="space-y-2">
        <p className="text-2xl font-bold">Categories</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {categories.map((category, index) => (
            <Card key={index} className="pt-2 pb-2">
              <CardHeader className="text-center">
                <CardTitle>{category}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Product Section */}
      <ProductSection categories={categories} />
    </>
  );
};

export default ProductCategorySection;
