import React from 'react'
import { formatMoney, classNames as cn } from '@utils'
import './OptionCard.scss'

function OptionCard ({
  classes = '',
  isSelected = false,
  name = '',
  description = '',
  price = '',
  type = 'individual',
  id = '',
  onSelect = null
}) {
  return (
    <div className={cn(
        'option-card',
        classes,
        isSelected && 'is-selected',
        'is-type-' + type
      )}
      onClick={() => { onSelect && onSelect(id) }}
    >
      <div className='option-card__icon'>
        <i className='icon-cart'></i>
      </div>

      <div className='option-card__details'>
        <h5 className='is-title-3 is-sans option-card__name'>{name}</h5>

        <div className='option-card__desc'>{description}</div>

        <div className='option-card__price is-bold'>
          <span className='price-val'>
            {formatMoney(price, { minimumFractionDigits: 0 })}
          </span>
          <span className='price-per-hr'> /30분</span>
        </div>
      </div>

      <div className='option-card__input'>
        <label className='radio is-large'>
          <input type='radio' checked={isSelected} readOnly={true} />
  
          <span className='radio__label'></span>
        </label>
      </div>
    </div>
  )
}

export default React.memo(OptionCard)
