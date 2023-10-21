import React from 'react'

// components
import PageTemplate from '../PageTemplate'
import RocketIcon from '@components/svg-icons/RocketIcon'

import './PaymentInstruction.scss'

export default function PaymentInstruction () {
  return (
    <PageTemplate classes='page-payment-instruction'>
      <div className='page-width-constraints'>
        <RocketIcon classes='page-icon' width='80' />

        <h3 className='is-title-3'>예약이 접수되었습니다.</h3>
      </div>
    </PageTemplate>
  )
}
