import React from 'react'

import PageTemplate from '../PageTemplate'

import './Inquiry.scss'

export default function Inquiry () {
  return (
    <PageTemplate classes='page-inquiry'>
      <div className='page-width-constraints'>
        <h2 className='is-title-2 is-sans mb-40 page-title'>
          <i className='icon-mail is-prefix'></i>
          <span>문의하기</span>
        </h2>

        <p>문의하기 페이지.</p>
      </div>
    </PageTemplate>
  )
}
