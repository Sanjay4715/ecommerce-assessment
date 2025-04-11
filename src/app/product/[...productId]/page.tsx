import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import ZoomableImage from "@/components/ZoomableImage/ZoomableImage";

const ProductDetails = () => {
  const product = {
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
  };

  return (
    <div className="pl-5 pr-5 sm:pl-40 sm:pr-40 pt-5 pb-5">
      <div className="flex space-x-10">
        <div>
          <ZoomableImage src={product.image} alt={product.title} />
        </div>
        <div className="flex flex-col space-y-2">
          <div className="space-x-3">
            <div className="text-3xl font-bold">{product.title}</div>
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
    </div>
  );
};

export default ProductDetails;
