import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { classNames as cn } from '@utils'
import './ToolbarCommon.scss'

const { IlwolLogo } = React.Global

const navigationList = [
  {
    id: 'home',
    linkTo: '/',
    name: '홈',
    disableCondition: currPath => currPath === '/'
  },
  {
    id: 'booking',
    linkTo: '/booking/counsel-option',
    name: '예약',
    disableCondition: currPath => currPath.includes('/booking')
  },
  {
    id: 'inquiry',
    linkTo: '/inquiry',
    name: '문의',
    disableCondition: currPath => currPath === '/inquiry'
  },
]

export default function Toolbar ({ hidden = false , classes = '' }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const clickHandler = entry => {
    if (entry.disableCondition(pathname)) { return }

    navigate(entry.linkTo)
  }

  return (
    <div className={cn('app-toolbar', classes)}>
      <div className='left-group'>
        <h1 className='is-title-4 is-serif toolbar-title'
          onClick={() => navigate('/')}
          data-test='toolbar-title'>
          <IlwolLogo classes='toolbar-logo' width={16} />
          <span>일월선녀 해달별</span>
        </h1>
      </div>
      <ul data-test='toolbar-menu-list' className='right-group'>
        {
          navigationList.map(entry => (
            <li key={entry.id}
              className='nav-item'
              data-test={`toolbar-menu-${entry.id}`}
              onClick={() => clickHandler(entry)}>
              <button className='is-unstyled is-serif'>{entry.name}</button>
            </li>
          ))
        }
      </ul>
    </div>
  )
}
