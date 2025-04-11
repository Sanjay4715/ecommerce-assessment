import ProductCategorySection from "./HomePage/ProductCategorySection";

export default function Home() {
  return (
    <div className="pl-5 pr-5 sm:pl-20 sm:pr-20 pt-5 pb-5">
      <div className="min-h-[70vh] bg-background space-y-5">
        <ProductCategorySection />
      </div>
    </div>
  );
}
