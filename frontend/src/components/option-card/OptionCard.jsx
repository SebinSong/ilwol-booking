import React from 'react'
import { formatMoney, classNames as cn } from '@utils'
import './OptionCard.scss'

export default function OptionCard ({
  classes = '',
  isSelected = false,
  name = '',
  description = '',
  price = ''
}) {
  return (
    <div className={cn('option-card', classes, isSelected && 'is-selected')}>
      <div className='option-card__details'>
        <h5 className='is-title-5 option-card__name'>{name}</h5>
        <div className='option-card__desc text-color-grey'>{description}</div>
      </div>

      <div className='option-card__price'>
        <span className='price-val'>
          {formatMoney(price, { minimumFractionDigits: 0 })}
        </span>
        <span className='price-per-hr'> / 시간</span>
      </div>
    </div>
  )
}
