'use client'

import React from "react";
import CategoryNav from "../../components/CategoryNav";
import ProductsSection from "../../components/ProductsSection";
import Marquee from "@/components/Marquee";

const categories = [
  { id: "popular", name: "Популярные наборы" },
  { id: "chocolate", name: "Клубника в шоколаде" },
  { id: "limited", name: "Лимитированная коллекция" },
  { id: "mix", name: "Наборы микс" },
  { id: "bouquets", name: "Букеты с клубникой" },
  { id: "combo", name: "Комбо наборы" },
];

const StrawberryPage = () => {

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-6">Клубника в шоколаде</h1>

      <div className="mt-6">
        <Marquee />
      </div>

      <div className="container mx-auto px-4">
        <CategoryNav
          categories={categories}
        />

        {categories.map((category) => (
            <div key={category.id} id={category.id} className="my-8">
              <ProductsSection
                title={category.name}
                category={category.id}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default StrawberryPage;