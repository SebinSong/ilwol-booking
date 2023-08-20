import React from 'react'
import { classNames as cn } from '@utils'
import './Toolbar.scss'

export default function Toolbar ({ hidden = false , classes = '' }) {
  return (
    <div className={cn('app-toolbar', classes)}>
      <div className='left-group'>
        <h1>일월선녀 해달별</h1>
      </div>
      <ul className='right-group'>
        <li className='nav-item'>
          <button>홈</button>
        </li>

        <li className='nav-item'>
          <button>예약</button>
        </li>

        <li className='nav-item'>
          <button>문의</button>
        </li>
      </ul>
    </div>
  )
}
