type Rating = {
  rate: number;
  count: number;
};

export type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  rating: Rating;
  quantity?: number;
};
