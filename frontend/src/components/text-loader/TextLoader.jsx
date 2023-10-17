import React from 'react'

const { LoaderSpinner } = React.Global

import './TextLoader.scss'

export default function ({ children = '로딩중..', classes = '' }) {
  return (
    <div className={`text-loader-container ${classes}`}>
      <LoaderSpinner width={22} />

      <p className='loader-text'>{children}</p>
    </div>
  )
}
