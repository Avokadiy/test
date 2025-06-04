'use client';

import { useEffect, useState } from 'react';

function useSheetProducts(category) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products?category=${category}`);
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных с сервера');
        }
        const data = await response.json();

        // Логируем полученные данные для проверки
        console.log('Полученные данные продуктов:', data); //TODO_DELETE

        // Проверяем структуру данных перед их установкой
        if (Array.isArray(data)) {
          data.forEach(product => {
            if (!product.id || !product.name || !product.price || !Array.isArray(product.sliders)) {
              console.warn('Неверные данные для продукта:', product);
            }
          });
        }

        setProducts(data);
      } catch (err) {
        console.error('Ошибка:', err);
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return { products, loading, error };
}

export { useSheetProducts };