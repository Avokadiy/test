import Link from 'next/link'
import { useCart } from '../store/cartContext'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import extra from '../../public/icons/extra.svg'

const MobileMenu = () => {
    const { cart } = useCart()
    const router = useRouter()
    const pathname = usePathname()

    const goToCart = () => {
        router.push('/cart')
    }

    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <div className="h-[50px]"></div>
            <nav className="bg-[#FFFFFF] fixed top-0 left-0 w-full h-[50px] shadow-md z-50">
                <div className="container mx-auto flex justify-between items-center h-full px-4">
                    <Link href="/" className="text-2xl font-bold text-black">
                        Логотип
                    </Link>
                    <button
                        onClick={() => {setIsOpen(!isOpen)}}
                    >
                        <Image
                            className='hover:bg-gray-300 rounded-full p-1'
                            src={extra}
                            alt=''
                            width={40}
                            height={40}
                        />
                    </button>
                    <div className={`${isOpen ? 'flex' : 'hidden'}`}>
                        <ul className='flex flex-col absolute top-13 left-0 rounded-b-md w-full gap-6 bg-white text-black font-semibold'>
                            {[
                                { name: 'Клубника в шоколаде', path: '/strawberry' },
                                { name: 'Цветы', path: '/flowers' },
                                { name: 'Акции', path: '/deals' },
                            ].map((item) => (
                                <li key={item.path} className="relative flex m-auto">
                                    <Link
                                        href={item.path}
                                        className={`hover:text-red-500 ${pathname === item.path ? 'text-red-500' : ''
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                    {pathname === item.path && (
                                        <span className="absolute bottom-[-3px] left-0 w-full h-[1px] bg-black"></span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="text-black mr-4">+7 123 456 7890</div>

                    <div className="relative">
                        <button
                            onClick={goToCart}
                            className="cursor-pointer flex items-center relative"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                className="text-black"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 3h18l-2 9H5l-2-9zM6 14h12m-6 4v4"
                                />
                            </svg>
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#F1ADAE] text-black text-xs font-bold rounded-full px-2">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default MobileMenu