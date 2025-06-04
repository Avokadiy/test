'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useCart } from '../store/cartContext';
import { useSheetProducts } from '../hooks/useSheetProducts';
import Image from 'next/image';
import ProductSlider from './ProductSlider';  // Импортируем компонент ProductSlider
import { Swiper, SwiperSlide } from "swiper/react";

const ProductsSection = ({ id, title, category }) => {
  const { addToCart } = useCart();
  const { products, loading, error } = useSheetProducts(category);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [finalPrice, setFinalPrice] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  // Вызов useMemo до всего кода компонента, чтобы избежать изменений порядка
  const sliderSettings = useMemo(() => ({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  }), []);

  const openModal = useCallback((product) => {
    setSelectedProduct(product);
    setSelectedOption('');
    setFinalPrice(product.price);
    setIsModalOpen(true);
    setSelectedImage(product.image); // Сначала показываем основное изображение
  }, []);

  const closeModal = useCallback(() => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  }, []);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    const basePrice = selectedProduct.price;
    if (selectedProduct.options?.size?.length) {
      const i = selectedProduct.options.size.indexOf(option);
      if (i !== -1) {
        setFinalPrice(basePrice + i * 600);
      }
    } else if (selectedProduct.options?.quantity?.length) {
      const i = selectedProduct.options.quantity.indexOf(Number(option));
      if (i !== -1) {
        setFinalPrice(basePrice + i * 600);
      }
    }
  };

  const handleAddToCart = () => {
    if (!selectedOption) {
      alert('Выберите вариант!');
      return;
    }
    addToCart({ ...selectedProduct, selectedOption, price: finalPrice });
    closeModal();
  };

  // Лоадер или ошибка
  if (loading) return <div className="loader">Загрузка...</div>;
  if (error) return <p className="text-red-500">Ошибка: {error}</p>;

  return (
    <section id={id} className="my-8">
      <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <p className="text-center">Нет товаров в этой категории.</p>
        ) : (
          products.map((product) => {
            if (product.category !== category) return;
            if (!product.name || !product.price || !product.image) {
              console.error(`Ошибка: отсутствуют обязательные данные для продукта с id ${product.id}`);
              return null;
            }

            // Если у продукта есть несколько изображений, показываем слайдер
            const isSlider = product.images && Array.isArray(product.images) && product.images.length > 1;

            return (
              <div key={product.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between">
                <div className="relative w-full 2x1:h-100">
                  {isSlider ? (
                    <ProductSlider images={product.images} productName={product.name} />
                  ) : (
                    <Image
                      src={product.image} // Плейсхолдер
                      alt={product.name}
                      width={400}
                      height={500}
                      className="object-cover rounded-md cursor-pointer"
                      onClick={() => openModal(product)}
                      loading="lazy"
                    />
                  )}
                </div>
                <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.description || 'Без описания'}</p>
                <p className="text-red-500 font-bold">{product.price} ₽</p>
                <button
                  className="mt-2 bg-[#F1ADAE] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#ec9898] transition"
                  onClick={() => openModal(product)}
                >
                  Заказать
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Модалка с слайдером */}
      {isModalOpen && selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm animate-fade-in"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-2xl transform transition-all scale-100 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-xl font-bold text-gray-500"
              onClick={closeModal}
            >
            </button>
            <h3 className="text-xl font-bold text-center mb-2">{selectedProduct.name}</h3>
            <p className="text-gray-600 text-center">{selectedProduct.description || 'Без описания'}</p>

            <div className="mb-4">
              <ProductSlider images={selectedProduct.images} productName={selectedProduct.productName}/>
            </div>
            <div>
              {selectedProduct.size?.map((option, index) => (
                <div key={index}>
                  <p>{option}</p>
                </div>
              ))}
            </div>


            <p className="text-lg font-bold text-red-600 mb-4">Итого: {finalPrice} ₽</p>
            <button
              onClick={handleAddToCart}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Добавить в корзину
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductsSection;