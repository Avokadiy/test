'use client';
import React, { useState, useEffect } from 'react';
import { useCart } from '../../store/cartContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const orderSchema = z.object({
  senderName: z.string().min(1, 'Имя отправителя обязательно'),
  senderEmail: z.string().email('Некорректный E-mail'),
  senderPhone: z
    .string()
    .min(10, 'Телефон должен содержать не менее 10 символов'),
  contactMethod: z.string().optional(),
  deliveryDate: z.string().min(1, 'Выберите дату доставки'),
  deliveryTime: z.string().min(1, 'Выберите время доставки'),
  deliveryMethod: z.string().optional(),
  recipientName: z.string().min(1, 'Имя получателя обязательно'),
  recipientPhone: z
    .string()
    .min(10, 'Телефон получателя должен содержать не менее 10 символов'),
  recipientAddress: z.string().optional(),
  comment: z.string().optional(),
  promoCode: z.string().optional(),
  paymentMethod: z.string().optional(),
  agreeTerms: z
    .boolean()
    .refine((val) => val === true, 'Вы должны согласиться с условиями'),
});

const CartPage = () => {
  const { cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useCart();
  const [storedCart, setStoredCart] = useState(cart);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(orderSchema),
  });

  useEffect(() => {
    setValue('deliveryDate', selectedDate.toLocaleDateString('ru-RU'));
  }, [selectedDate, setValue]);

  useEffect(() => {
    setValue('deliveryTime', selectedTime);
  }, [selectedTime, setValue]);

  const total = storedCart.reduce(
    (sum, product) =>
      sum +
      parseFloat(String(product.price).replace(' ₽', '').replace(' ', '')) *
        (product.quantity || 1),
    0
  );

  const handleRemove = (productId, option) => {
    const updatedCart = storedCart.filter((product) => product.id !== productId || product.selectedOption !== option);
    setStoredCart(updatedCart);
  };

  const handleClearCart = () => {
    setStoredCart([]);
    localStorage.removeItem('cart');
  };

  const closeModal = () => setIsModalOpen(false);

  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleOrder = (data) => {
    console.log('ORDER DATA:', data);
    setOrderConfirmed(true);
    setIsModalOpen(false);
    clearCart();
    reset();
  };

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setStoredCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(storedCart));
  }, [storedCart]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Корзина</h1>
      {storedCart.length === 0 ? (
        <p>
          Корзина пуста.{' '}
          <Link href="/" className="text-blue-500">
            Вернуться к покупкам
          </Link>
        </p>
      ) : (
        <div>
          <ul>
            {storedCart.map((product, index) => (
              <li
                key={`${product.id}-${product.selectedOption}-${index}`}
                className="flex justify-between items-center py-4 border-b"
              >
                <div className="flex items-center">
                  <Image
                    src={product.image}
                    alt={product.name}
                    layout="responsive"
                    width={500}
                    height={500}
                    className="object-cover mx-auto rounded-md"
                  />
                  <div className='ml-5'>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm">{product.price}</p>
                    <p className="text-sm">{product.selectedOption}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQuantity(product.id, product.selectedOption)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span>{product.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(product.id, product.selectedOption)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemove(product.id, product.selectedOption)}
                    className="text-red-500 ml-4"
                  >
                    Удалить
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-between items-center">
            <p className="font-semibold">Итоговая сумма: {total} ₽</p>
            <button
              onClick={handleClearCart}
              className="bg-red-500 text-white py-2 px-4 rounded-md"
            >
              Очистить корзину
            </button>
          </div>

          <div className="mt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-500 text-white py-2 px-4 rounded-md"
            >
              Оформить заказ
            </button>
          </div>
        </div>
      )}

      {/* Модальное окно */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={handleClickOutside}
        >
          <div className="bg-white p-8 rounded-md w-full max-w-lg relative overflow-auto max-h-[90%] animate-fade-in">
            <button
              className="absolute top-4 right-4 text-xl font-bold text-gray-500"
              onClick={closeModal}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6">Оформление заказа</h2>
            <form onSubmit={handleSubmit(handleOrder)} className="space-y-4">
              <div>
                <label>Имя отправителя</label>
                <input
                  {...register('senderName')}
                  placeholder="Имя отправителя"
                  className="w-full p-2 border rounded-md"
                />
                {errors.senderName && (
                  <p className="text-red-500">{errors.senderName.message}</p>
                )}
              </div>

              <div>
                <label>E-mail отправителя</label>
                <input
                  {...register('senderEmail')}
                  placeholder="E-mail"
                  className="w-full p-2 border rounded-md"
                />
                {errors.senderEmail && (
                  <p className="text-red-500">{errors.senderEmail.message}</p>
                )}
              </div>

              <div>
                <label>Телефон отправителя</label>
                <input
                  {...register('senderPhone')}
                  placeholder="Телефон отправителя"
                  className="w-full p-2 border rounded-md"
                />
                {errors.senderPhone && (
                  <p className="text-red-500">{errors.senderPhone.message}</p>
                )}
              </div>

              <div>
                <label>Дата доставки</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label>Время доставки</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Выберите время</option>
                  <option value="9:00">9:00</option>
                  <option value="12:00">12:00</option>
                  <option value="15:00">15:00</option>
                  <option value="18:00">18:00</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  {...register('agreeTerms')}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                  className="form-checkbox"
                />
                <label>Я согласен с условиями</label>
                {errors.agreeTerms && (
                  <p className="text-red-500">{errors.agreeTerms.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-4 rounded-md mt-4"
                disabled={!isChecked}
              >
                Подтвердить заказ
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;