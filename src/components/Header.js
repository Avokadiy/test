import React from "react";
import Marquee from "@/components/Marquee"; // путь подставь свой, если структура отличается

const Header = () => {
  return (
    <header className="bg-F8DAD8 text-center py-12">
      {/* Заголовок */}
      <h1 className="text-5xl font-bold text-9E0E05">
        Свежая клубника в шоколаде и цветы
      </h1>
      <p className="text-xl text-49321d mt-4">
        Подарите радость и сладкие моменты
      </p>

      {/* Бегущая строка */}
      <div className="mt-6">
        <Marquee />
      </div>

      {/* Кнопки навигации */}
      {/* <div className="mt-6 flex justify-center gap-4">
        <a href="#strawberry" className="bg-49321d text-white px-6 py-3 rounded-full hover:bg-F1ADAE transition">
          Клубника в шоколаде
        </a>
        <a href="#flowers" className="bg-49321d text-white px-6 py-3 rounded-full hover:bg-F1ADAE transition">
          Цветы
        </a>
      </div> */}
    </header>
  );
};

export default Header;