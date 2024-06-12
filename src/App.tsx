import { CSSProperties, useEffect, useState } from 'react'
import { NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import netflixLogo from './assets/netflix.svg'
import './stylesheets/App.css'
import { useAtomValue } from 'jotai'
import { lockScrollingAtom, scrollPositionAtom } from './libs/atoms'

export default function App() {
  const lockScrolling = useAtomValue(lockScrollingAtom)
  const scrollPosition = useAtomValue(scrollPositionAtom)

  useEffect(() => {
    if (lockScrolling)
      window.scrollTo({ top: 0 })
    else if (scrollPosition > 0)
      window.scrollTo({ top: scrollPosition })
  }, [lockScrolling])

  const style = {
    position: 'fixed',
    top: scrollPosition * -1,
  } as CSSProperties

  return (
    <div className="body" style={lockScrolling ? style : undefined}>
      <Nav />
      <Outlet />
      <ScrollRestoration />
    </div>
  )
}

function Nav() {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 0)
    })
  }, [])

  return (
    <nav className={`navbar ${isScrolled ? 'navbar--scrolled': ''}`}>
      <div className="navbar__container">
        <NavLink to="/browse" className="navbar__logo">
          <img src={netflixLogo} alt="Netflix" />
        </NavLink>
        <div className="navbar__menu">
          <NavLink to="/browse" className="navbar__link">Home</NavLink>
          <NavLink to="/my-list" className="navbar__link">My List</NavLink>
        </div>
      </div>
      {location.pathname == '/my-list' &&
        <div className="navbar-header">My List</div>
      }
    </nav>
  )
}
