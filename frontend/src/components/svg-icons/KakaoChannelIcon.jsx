import React from 'react'

import './InlineSvgIconCommon.scss'

export default function KakaoChannelIcon ({
  classes = '',
  width = 55,
  onClick = () => {}
}) {
  return (
    <div className={`inline-svg-common ${classes}`}
      onClick={onClick}>
      <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 147.24 148.08"
        width={width} height={width} fill="none">
        <path fill="#fae100" d="M147.24,115.13c0,18.2-14.67,32.95-32.76,32.95H32.76c-18.09,0-32.76-14.75-32.76-32.95V32.95C0,14.75,14.67,0,32.76,0h81.72c18.09,0,32.76,14.75,32.76,32.95v82.19Z"/>
        <path fill="#fae100" d="M73.54,32.33c-25.72,0-46.57,19.28-46.57,43.07,0,17.57,7.36,25.96,17.44,33.6l.05.02v20.62c0,.98,1.11,1.53,1.89.95l17.66-13.11.38.16c2.96.55,6.02.83,9.15.83,25.72,0,46.56-19.28,46.56-43.07s-20.85-43.07-46.56-43.07"/>
        <path fill="#020303" d="M73.54,26c-25.72,0-46.57,19.28-46.57,43.07,0,17.57,7.36,25.96,17.44,33.6l.05.02v20.62c0,.98,1.11,1.53,1.89.95l17.66-13.11.38.16c2.96.55,6.02.83,9.15.83,25.72,0,46.56-19.28,46.56-43.07s-20.85-43.07-46.56-43.07M57.93,79.99c4.57,0,8.47-2.73,9.65-6.95h6.75c-1.65,8.12-7.97,13.45-16.39,13.45-9.79,0-17.55-7.3-17.55-17.46s7.76-17.46,17.55-17.46c8.51,0,14.87,5.43,16.44,13.7h-6.73c-1.02-4.49-5.06-7.29-9.71-7.29-6.58,0-10.96,4.69-10.96,11.05s4.98,10.96,10.96,10.96M102.42,85.81h-6.19v-13.96c0-3.21-1.87-4.94-4.75-4.94-3.21,0-5.27,1.97-5.27,5.95v12.95h-6.19v-34.14h6.19v12.84c1.48-2.25,3.88-3.36,7.14-3.36,2.64,0,4.8.86,6.47,2.64,1.73,1.77,2.59,4.17,2.59,7.29v14.73Z"/>
      </svg>
    </div>
  )
}
