import React, { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { NavMenuContext } from '@hooks/useNavMenu.js'
import { classNames as cn } from '@utils'

import './AdminNavigation.scss'

const adminNavList = [
  {
    id: 'dashboard',
    name: '대시보드',
    icon: 'home',
    routeTo: '/admin/dashboard'
  },
  {
    id: 'manage-reservation',
    name: '예약 관리',
    icon: 'bulleted-list',
    routeTo: '/admin/manage-reservation'
  },
  {
    id: 'inquiry',
    name: '고객 문의사항',
    icon: 'mail',
    routeTo: '/admin/inquiry'
  }
]

function AdminNavigation ({ classes = '' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    toggleNavMenu,
    closeNavMenu,
    isNavOpen
  } = useContext(NavMenuContext)

  return (
    <div className={cn('admin-navigation', classes, isNavOpen && 'is-open')}>
      <div className='admin-navigation__backdrop'
        onClick={closeNavMenu}></div>

      <div className='admin-navigation__list'>
        {
          adminNavList.map(
            entry => (
              <div className={cn(
                  'admin-navigation__nav-item',
                  location.pathname === entry.routeTo && 'is-active'
                )}
                key={entry.id}
                tabIndex='0'
                onClick={() => navigate(entry.routeTo)}
              >
                <i className={`icon-${entry.icon} nav-item-icon`}></i>
                <span className='nav-item-name'>{entry.name}</span>
              </div>
            )
          )
        }

        <button className='is-unstyled admin-navigation__close-btn'
          onClick={toggleNavMenu}>
          <i className='icon-close'></i>
        </button>
      </div>
    </div>
  )
}

export default AdminNavigation