import Header from "../components/Header";
import ProductsSection from "../components/ProductsSection"; // Импортируем компонент

export default function Home() {
  return (
    <main>
      <Header />
      <section className="text-center py-2">
        <h2 className="text-4xl font-bold text-[#9E0E05]">Лучшие букеты и клубника в шоколаде</h2>
      </section>
      <ProductsSection id="products" category="popular" title="Популярные товары" /> {/* Добавляем компонент ProductsSection */}
    </main>
  );
}