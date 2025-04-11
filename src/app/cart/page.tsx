"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import CartProductCard from "./CartProductCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Cart = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const mockProducts = [
    {
      id: "1",
      title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
      price: 109.95,
      description:
        "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve.",
      category: "men's clothing",
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
      rating: {
        rate: 3.9,
        count: 120,
      },
    },
    {
      id: "2",
      title: "Mens Casual Premium Slim Fit T-Shirts",
      price: 22.3,
      description:
        "Slim-fitting style, contrast raglan long sleeve, three-button henley placket.",
      category: "men's clothing",
      image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_UL640_QL65_ML3_.jpg",
      rating: {
        rate: 4.1,
        count: 259,
      },
    },
    {
      id: "3",
      title: "Solid Gold Petite Micropave",
      price: 168.0,
      description:
        "Satisfaction Guaranteed. Return or exchange any order within 30 days.",
      category: "jewelery",
      image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
      rating: {
        rate: 4.6,
        count: 400,
      },
    },
    {
      id: "4",
      title: "White Gold Plated Princess",
      price: 9.99,
      description:
        "Classic Created Wedding Engagement Solitaire Diamond Ring for Her.",
      category: "jewelery",
      image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
      rating: {
        rate: 3.0,
        count: 100,
      },
    },
    {
      id: "5",
      title: "WD 2TB Elements Portable External Hard Drive",
      price: 64.0,
      description: "USB 3.0 and USB 2.0 Compatibility. Fast data transfers.",
      category: "electronics",
      image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
      rating: {
        rate: 4.8,
        count: 319,
      },
    },
    {
      id: "6",
      title: "SanDisk SSD PLUS 1TB Internal SSD",
      price: 109.0,
      description:
        "Easy upgrade for faster boot-up, shutdown, application load and response.",
      category: "electronics",
      image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
      rating: {
        rate: 4.7,
        count: 500,
      },
    },
    {
      id: "7",
      title: "BIYLACLESEN Men's 3-in-1 Snowboard Jacket",
      price: 99.99,
      description:
        "Waterproof and windproof ski jacket for outdoor winter sports.",
      category: "men's clothing",
      image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
      rating: {
        rate: 4.2,
        count: 150,
      },
    },
    {
      id: "8",
      title:
        "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
      price: 29.95,
      description:
        "100% polyurethane (shell), 100% polyester (lining). Removable hood.",
      category: "women's clothing",
      image: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg",
      rating: {
        rate: 4.0,
        count: 340,
      },
    },
    {
      id: "9",
      title:
        "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
      price: 695.0,
      description:
        "Legendary Naga dragon bracelet inspired by Balinese mythology.",
      category: "jewelery",
      image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
      rating: {
        rate: 4.6,
        count: 400,
      },
    },
    {
      id: "10",
      title: "MBJ Women's Solid Short Sleeve Boat Neck V ",
      price: 9.85,
      description:
        "Lightweight and soft fabric with stretch. Ideal for layering.",
      category: "women's clothing",
      image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg",
      rating: {
        rate: 4.0,
        count: 200,
      },
    },
    {
      id: "11",
      title: "Rain Jacket Women's Lightweight Waterproof Raincoat",
      price: 39.99,
      description: "Perfect for outdoor activities. Lightweight and packable.",
      category: "women's clothing",
      image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg",
      rating: {
        rate: 4.3,
        count: 300,
      },
    },
    {
      id: "12",
      title: "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor",
      price: 999.99,
      description:
        "Super ultra-wide 32:9 curved gaming monitor with 144Hz refresh rate.",
      category: "electronics",
      image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg",
      rating: {
        rate: 4.5,
        count: 250,
      },
    },
    {
      id: "13",
      title: "Acer SB220Q bi 21.5 inches Full HD",
      price: 599.99,
      description:
        "Ultra-thin monitor with HDMI and VGA ports. 1920 x 1080 resolution.",
      category: "electronics",
      image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
      rating: {
        rate: 4.7,
        count: 700,
      },
    },
    {
      id: "14",
      title: "Opna Women's Short Sleeve Moisture",
      price: 7.95,
      description:
        "Moisture-wicking performance tee. Lightweight, comfortable, and athletic.",
      category: "women's clothing",
      image: "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg",
      rating: {
        rate: 4.5,
        count: 450,
      },
    },
    {
      id: "15",
      title: "DANVOUY Womens T Shirt Casual Cotton Short",
      price: 12.99,
      description:
        "Stylish t-shirt with graphic print. Great for everyday wear.",
      category: "women's clothing",
      image: "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg",
      rating: {
        rate: 4.1,
        count: 300,
      },
    },
    {
      id: "16",
      title: "Cotton Hooded Zip Jacket",
      price: 42.99,
      description:
        "Comfortable, breathable hoodie with zip-up front and pockets.",
      category: "men's clothing",
      image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
      rating: {
        rate: 4.3,
        count: 120,
      },
    },
    {
      id: "17",
      title: "Casual Men's Wrist Watch",
      price: 79.99,
      description:
        "Elegant analog wrist watch with a leather band and classic face.",
      category: "jewelery",
      image: "https://fakestoreapi.com/img/71fwbMm1NBL._AC_UL640_QL65_ML3_.jpg",
      rating: {
        rate: 4.4,
        count: 250,
      },
    },
    {
      id: "18",
      title: "Bluetooth Over-Ear Headphones",
      price: 89.99,
      description:
        "Noise-canceling Bluetooth headphones with 20-hour battery life.",
      category: "electronics",
      image: "https://fakestoreapi.com/img/81OaXwn1x4L._AC_SX679_.jpg",
      rating: {
        rate: 4.6,
        count: 310,
      },
    },
    {
      id: "19",
      title: "Elegant Silver Pendant Necklace",
      price: 29.99,
      description:
        "Stunning silver necklace with a heart-shaped pendant and crystal inlay.",
      category: "jewelery",
      image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
      rating: {
        rate: 4.2,
        count: 200,
      },
    },
    {
      id: "20",
      title: "Men's Waterproof Sports Watch",
      price: 59.99,
      description:
        "Durable and waterproof sports watch with stopwatch and LED display.",
      category: "jewelery",
      image: "https://fakestoreapi.com/img/61aP3mxf+GL._AC_UL640_QL65_ML3_.jpg",
      rating: {
        rate: 4.5,
        count: 280,
      },
    },
  ];

  const calculateTotal = () => {
    return mockProducts.reduce((acc, item) => {
      acc += item.price;
      return acc;
    }, 0);
  };

  return (
    <div className="min-h-[90vh] pl-5 pr-5 sm:pl-20 sm:pr-20 pt-5 pb-5">
      <div>Shopping Cart</div>
      <div className="flex space-x-5">
        <div className="w-[70%] space-y-2">
          <Card className="gap-0">
            <CardHeader className="flex items-center space-x-3 gap-0 font-bold">
              <div className="w-[15%] flex justify-center">Image</div>
              <div className="w-[50%] space-y-2">Product Title</div>
              <div className="w-[20%] flex justify-center">Price</div>
              <div className="w-[20%] flex justify-center">Quantity</div>
              <div className="w-[20%] flex justify-center">Sub Total</div>
            </CardHeader>
          </Card>
          {mockProducts.map((product, index) => (
            <CartProductCard key={index} product={product} />
          ))}
        </div>
        <Card className="w-[30%] h-fit">
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
                <div>abc</div>
                <div>efg</div>
              </CollapsibleContent>
            </Collapsible>
            <Button className="cursor-pointer" onClick={() => router.push("/checkout")}>
              Proceed to checkout
            </Button>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
