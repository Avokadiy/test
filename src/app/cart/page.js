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
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isSending, setIsSending] = useState(false);

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

  useEffect(() => {
    console.log('Ошибки формы:', errors);
  }, [errors]);

  // Используем cart из контекста вместо локального состояния
  const total = cart.reduce(
    (sum, product) =>
      sum +
      parseFloat(String(product.price).replace(' ₽', '').replace(' ', '')) *
        (product.quantity || 1),
    0
  );

  const closeModal = () => setIsModalOpen(false);

  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleOrder = (data) => {
    console.log('ORDER DATA:', data);
    sendData(data); // Отправляем данные в Telegram
    setOrderConfirmed(true);
    setIsModalOpen(false);
    clearCart();
    reset();
  };

  const handleSubmitOrder = handleSubmit(async (data) => {
  console.log('Начало обработки формы'); // Добавьте этот лог
  if (cart.length === 0) {
    alert('Корзина пуста');
    return;
  }

  setIsSending(true);
  try {
    console.log('Данные формы перед отправкой:', data);
    await sendData(data);
    console.log('Данные успешно отправлены');
    
    setOrderConfirmed(true);
    setIsModalOpen(false);
    clearCart();
    reset();
    alert('Заказ успешно оформлен!');
  } catch (error) {
    console.error('Ошибка оформления:', error);
    alert('Ошибка: ' + error.message);
  } finally {
    setIsSending(false);
  }
});

  async function sendData(formData) {
  try {
    // Формируем сообщение для Telegram
    let message = `<b>📦 Новый заказ!</b>\n\n`;
    
    // Добавляем данные формы
    message += `<b>👤 Отправитель:</b>\n`;
    message += `- Имя: ${formData.senderName}\n`;
    message += `- Email: ${formData.senderEmail}\n`;
    message += `- Телефон: ${formData.senderPhone}\n\n`;
    
    message += `<b>📅 Доставка:</b>\n`;
    message += `- Дата: ${formData.deliveryDate}\n`;
    message += `- Время: ${formData.deliveryTime}\n\n`;
    
    // Добавляем содержимое корзины
    message += `<b>🛒 Товары:</b>\n`;
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.selectedOption}) - ${item.quantity} × ${item.price}\n`;
    });
    
    message += `\n<b>💰 Итого: ${total} ₽</b>`;

    // Отправляем запрос к Telegram API
    const response = await fetch(`https://api.telegram.org/bot7969947917:AAGPqZxT7FxAmbR4HA8ntRVPTh0seL51law/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: '581497267',
        text: message,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Ошибка Telegram API:', data);
      throw new Error('Ошибка отправки сообщения');
    }

    console.log('Сообщение успешно отправлено:', data);
    return true;
  } catch (error) {
    console.error('Ошибка при отправке данных:', error);
    return false;
  }
}

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Корзина</h1>
      {cart.length === 0 ? (
        <p>
          Корзина пуста.{' '}
          <Link href="/" className="text-blue-500">
            Вернуться к покупкам
          </Link>
        </p>
      ) : (
        <div>
          <ul>
            {cart.map((product, index) => (
              <li
                key={`${product.id}-${product.selectedOption}-${index}`}
                className="flex justify-between items-center py-4 border-b"
              >
                <div className="flex items-center">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={150}
                    height={250}
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
                    onClick={() => removeFromCart(product.id, product.selectedOption)}
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
              onClick={clearCart}
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
            <form onSubmit={handleSubmitOrder} className="space-y-4">
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
                  minDate={Date.now()}
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
                className="bg-green-500 text-white py-2 px-4 rounded-md mt-4 disabled:opacity-50"
                disabled={!isChecked || isSending}
              >
                {isSending ? 'Отправка...' : 'Подтвердить заказ'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;