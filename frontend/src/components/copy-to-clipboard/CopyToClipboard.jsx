import React, { useContext } from 'react'
import { ToastContext } from '@hooks/useToast.js'

import './CopyToClipboard.scss'

function CopyToClipboard ({
  children = null,
  textToCopy = '',
  classes = '',
  toastOpt = {}
}) {
  const { addToastItem, unloadAllToast } = useContext(ToastContext)

  //methods
  const copyTextToClipboard = () => {
    if (!textToCopy) { return }

    if (navigator.clipboard) {
      try {
        navigator.clipboard.writeText(textToCopy)

        unloadAllToast()
        addToastItem({
          type: 'success',
          heading: '복사 완료!',
          content: '클립보드에 저장 되었습니다.',
          ...toastOpt
        })
      } catch (err) {
        console.error('copy-to-clipboard action failed: ', err)
      }
    }
  }

  return (
    <div className={`ctc-container ${classes}`}
      onClick={copyTextToClipboard}>
      <div className='ctc-content'>
        {
          children
            ? children
            : <span className='ctc-value'>{textToCopy}</span>
        }
      </div>

      <button className='is-unstyled ctc-btn'>
        <i className='icon-copy'></i>
      </button>
    </div>
  )
}

export default React.memo(CopyToClipboard)