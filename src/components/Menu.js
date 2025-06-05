'use client'

import { useState, useEffect } from 'react'
import MobileMenu from './MobileMenu'
import DesktopMenu from './DesktopMenu'

const Menu = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth < 768);
    }

    updateSize();

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [])

  return (
    <>
      {isMobile ? <MobileMenu /> : <DesktopMenu />}
    </>
  )
}

export default Menu
