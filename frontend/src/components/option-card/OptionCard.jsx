import React from 'react'
import { formatMoney, classNames as cn } from '@utils'
import './OptionCard.scss'

const iconClassMap = {
  'individual-counsel': 'icon-user',
  'overseas-counsel': 'icon-chat-bubbles',
  'family-counsel': 'icon-group'
}

const getDurationDisplay = (val) => {
  switch (val) {
    case 1:
      return '/시간'
    case 0.75:
      return '/30분-1시간'
    default:
      return '/30분'
  }
}

function OptionCard ({
  classes = '',
  isSelected = false,
  name = '',
  description = '',
  price = '',
  duration = 0.5,
  type = 'individual',
  id = '',
  onSelect = null
}) {
  const iconClass = iconClassMap[id] || 'icon-user'

  return (
    <div className={cn(
        'option-card',
        classes,
        isSelected && 'is-selected',
        'is-option-' + id
      )}
      onClick={() => { onSelect && onSelect(id) }}
    >
      <div className='option-card__icon'>
        <i className={iconClass}></i>
      </div>

      <div className='option-card__details'>
        <h5 className='is-title-3 is-sans option-card__name'>{name}</h5>

        <div className='option-card__desc'>{description}</div>

        <div className='option-card__price is-bold'>
          <span className='price-val'>
            {formatMoney(price, { minimumFractionDigits: 0 })}
            { ['family-counsel', 'overseas-counsel'].includes(id) && <span>~</span> }
          </span>
          <span className='price-per-hr'>
            { getDurationDisplay(duration) }
          </span>
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
