import React from 'react'

import './ContactLine.scss'

function ContactLine ({
  data = {}
}) {
  const {
    name,
    contact,
    contactType
  } = data

  return (
    <div className='admin-contact-line-container'>
      <div className='contact-line__upper-section'>
        <div className='contact-line__name'>{name}</div>
        <div className='contact-line__contact'>
          <span className='contact-value'>{contact}</span>
          <span className='contact-cta'></span>
        </div>

        <button className='is-unstyled contact-line__open-btn'>
          <i className='icon-chevron-down-circle'></i>
        </button>
      </div>
    
      <div className='contact-line__lower-section'>
        내용
      </div>
    </div>
  )
}

export default React.memo(ContactLine)
