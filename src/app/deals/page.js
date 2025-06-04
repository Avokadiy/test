import React from "react";
import ProductsSection from "../../components/ProductsSection";

const DealsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-6">Акции</h1>

      <div className="container mx-auto px-4">
        <ProductsSection />
      </div>
    </div>
  );
};

export default DealsPage;