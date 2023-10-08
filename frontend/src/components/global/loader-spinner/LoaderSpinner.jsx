import React from 'react'

export default function LoaderSpinner({
  classes = '',
  width = 20,
  border = 4
}) {
  return (
    <span className={`ilwol-loader ${classes}`}
      style={{
        '--loader-side': `${width}px`,
        '--loader-border': `${border}px`
      }}>
    </span>
  )
}
