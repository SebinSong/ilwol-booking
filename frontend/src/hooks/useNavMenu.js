import { useState, createContext, useCallback } from 'react'

export const NavMenuContext = createContext({})

export function useNavMenu () {
  const [isNavOpen, setIsNavOpen] = useState(false)

  // methods
  const toggleNavMenu = useCallback(
    () => { setIsNavOpen(v => !v) }, []
  )
  const openNavMenu = useCallback(
    () => setIsNavOpen(true), []
  )
  const closeNavMenu = useCallback(
    () => setIsNavOpen(false), []
  )

  return {
    toggleNavMenu,
    openNavMenu,
    closeNavMenu,
    isNavOpen
  }
}
