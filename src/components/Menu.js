'use client'

import { useState, useEffect } from 'react'
import MobileMenu from './MobileMenu'
import DesktopMenu from './DesktopMenu'

const Menu = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth < 768);
    }

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [])

  return (
    <>
      {isMobile ? <MobileMenu /> : <DesktopMenu />}
      {/* Отступ для контента, чтобы он не перекрывался меню */}

    </>
  )
}

export default Menu
