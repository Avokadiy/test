"use client";
import React, { useState, useEffect } from "react";

const CategoryNav = ({ categories }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const navButtons = document.getElementById("category-nav");
      if (navButtons) {
        setShowScrollTop(window.scrollY > navButtons.offsetTop + navButtons.offsetHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 60,
        behavior: "smooth",
      });
      setActiveCategory(id);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div id="category-nav" className="relative">
      <div className="flex flex-wrap justify-center gap-4 my-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleScroll(category.id)}
            className={`cursor-pointer px-4 py-2 rounded-md shadow-md transition-transform transform hover:scale-105
              ${activeCategory === category.id ? "bg-[#49321d]" : "bg-[#F1ADAE]"}
              hover:bg-[#49321d] text-white`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Кнопка "Вверх" (появляется при прокрутке вниз) */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed top-[60px] right-8 bg-[#9E0E05] text-white px-4 py-2 rounded-full shadow-md transition-opacity opacity-80 hover:opacity-100 z-50"
        >
          ↑ Вверх
        </button>
      )}
    </div>
  );
};

export default CategoryNav;