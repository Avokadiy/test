import React from "react";
import CategoryNav from "../../components/CategoryNav";
import ProductsSection from "../../components/ProductsSection";
import Marquee from "@/components/Marquee";

const categories = [
  { id: "popular", name: "Популярные букеты" },
  { id: "mixed", name: "Сборные букеты" },
  { id: "large", name: "Большие букеты" },
  { id: "hatboxes", name: "Шляпные коробки" },
  { id: "combo", name: "Комбо 2в1" },
  { id: "seasonal", name: "Сезонные цветы" },
  { id: "deals", name: "Акции" },
  { id: "roses", name: "Розы" },
  { id: "cards", name: "Открытки" },
  { id: "vases", name: "Вазы для цветов" },
];

const FlowersPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-6">Цветы</h1>

      <div className="mt-6">
        <Marquee />
      </div>

      <div className="container mx-auto px-4">
        <CategoryNav categories={categories} />

        {categories.map((category) => (
          <ProductsSection
            key={category.id}
            id={category.id}
            title={category.name}
            category={category.id}
          />
        ))}
      </div>
    </div>
  );
};

export default FlowersPage;