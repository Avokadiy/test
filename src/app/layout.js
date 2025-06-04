// src/app/layout.js
import { Montserrat, Unbounded, Rubik_Mono_One } from 'next/font/google'
import './globals.css'
import { CartProvider } from '../store/cartContext'
import Menu from '../components/Menu'
import Footer from '../components/Footer'
import WhyUs from '../components/WhyUs'
import Reviews from '../components/Reviews'
import HowToFind from '../components/HowToFind'
import { Toaster } from 'react-hot-toast';

// Подключаем шрифты
const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600'], // Обычный и жирный
})

const unbounded = Unbounded({
  variable: '--font-unbounded',
  subsets: ['latin', 'cyrillic'],
  weight: ['200'], // Extralight
})

const rubikMonoOne = Rubik_Mono_One({
  variable: '--font-rubik-mono-one',
  subsets: ['latin', 'cyrillic'],
  weight: ['400'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="../icons/strawberry.ico" />
        <title>BerryShop – Клубника в шоколаде и цветы</title>
      </head>
      <body
        className={`${montserrat.variable} ${unbounded.variable} ${rubikMonoOne.variable} antialiased`}
      >
        <CartProvider>
          <Menu />
          <main>{children}</main>
          <WhyUs />
          <Reviews />
          <HowToFind />
          <Footer />
          <Toaster position="top-center" reverseOrder={false} />
        </CartProvider>
      </body>
    </html>
  )
}
