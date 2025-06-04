'use client'
import React from 'react'
import { useCart } from '../store/cartContext'

const Cart = () => {
  const { cart } = useCart()

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-2">Корзина</h2>
      {cart.length === 0 ? (
        <p>Ваша корзина пуста</p>
      ) : (
        <ul>
          {cart.map((item, index) => (
            <li key={index} className="flex justify-between border-b py-2">
              <span>{item.name}</span>
              <span className="font-bold">{item.price}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Cart
