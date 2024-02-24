import React, { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { NavMenuContext } from '@hooks/useNavMenu.js'
import { classNames as cn } from '@utils'

const { IlwolLogo } = React.Global

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
    icon: 'calendar',
    routeTo: '/admin/manage-reservation'
  },
  {
    id: 'add-reservation-item',
    name: '예약 생성',
    icon: 'pencil',
    routeTo: '/admin/add-reservation-item'
  },
  {
    id: 'reservation-history',
    name: '예약 히스토리',
    icon: 'bulleted-list',
    routeTo: '/admin/reservation-history',
    hidden: true
  },
  {
    id: 'send-message',
    name: 'Web문자 전송',
    icon: 'mail',
    routeTo: '/admin/send-message'
  },
  {
    id: 'customer-contact',
    name: '고객 주소록',
    icon: 'id-card',
    routeTo: '/admin/customer-contact'
  },
  {
    id: 'manage-users',
    name: '관리자 계정 관리',
    icon: 'group',
    routeTo: '/admin/manage-users'
  }
].filter(entry => !entry.hidden)

function AdminNavigation ({ classes = '' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    toggleNavMenu,
    closeNavMenu,
    isNavOpen
  } = useContext(NavMenuContext)

  // methods
  const onItemClick = (routeTo) => {
    navigate(routeTo)
    closeNavMenu()
  }

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
                onClick={() => onItemClick(entry.routeTo)}
              >
                <i className={`icon-${entry.icon} nav-item-icon`}></i>
                <span className='nav-item-name'>{entry.name}</span>
              </div>
            )
          )
        }

        <IlwolLogo width={16} classes='nav-logo' />

        <button className='is-unstyled admin-navigation__close-btn'
          onClick={toggleNavMenu}>
          <i className='icon-close'></i>
        </button>
      </div>
    </div>
  )
}

export default AdminNavigation