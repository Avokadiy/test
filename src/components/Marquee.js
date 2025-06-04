// components/Marquee.js
import React from "react";

const MarqueeItem = ({ text }) => (
  <a
    href="/app/deals/page.js"
    className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-black whitespace-nowrap hover:underline transition"
  >
    <span className="text-sm sm:text-base">🍓</span>
    {text}
  </a>
);

const Marquee = () => {
  return (
    <div className="relative overflow-hidden bg-[#cea5a1] py-2 sm:py-3 marquee">
      {/* Градиенты по краям */}
      <div className="absolute left-0 top-0 h-full w-6 sm:w-10 bg-gradient-to-r from-[#cea5a1] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-6 sm:w-10 bg-gradient-to-l from-[#cea5a1] to-transparent z-10 pointer-events-none" />

      <div className="marquee-track">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex gap-x-4 px-2">
            <MarqueeItem text="Бесплатная доставка от 5000₽" />
            <MarqueeItem text="Открытка в подарок!" />
            <MarqueeItem text="Промокод 3% на первый заказ" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;