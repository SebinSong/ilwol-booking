import React from 'react'
import { classNames as cn } from '@utils'
import './Container.scss'

export default function Container ({ classes = '', children }) {
  return (
    <div className={cn('app-container', classes)}>
      {children}
    </div>
  )
}
