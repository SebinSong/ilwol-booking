import React from 'react'
import { useNavigate } from 'react-router-dom'

// components
import PageTemplate from '../PageTemplate'
import CommunicationIcon from '@components/svg-icons/CommunicationIcon'
import CopyToClipboard from '@components/copy-to-clipboard/CopyToClipboard'

const { WarningMessage } = React.Global

import './Inquiry.scss'

export default function Inquiry () {
  const navigate = useNavigate()

  return (
    <PageTemplate classes='page-inquiry'>
      <div className='page-width-constraints'>
        <div className='inquiry-content-container'>
          <CommunicationIcon classes='sent-icon' width='80' />

          <h3 className='is-title-4 mt-30'>기타 문의사항이 있으시면, 아래 연락처로 문의 바랍니다.</h3>

          <CopyToClipboard classes='mt-40'
            textToCopy='01095398700'
            toastOpt={{
              heading: '전화번호 복사',
              content: '선녀님 연락처가 클립보드에 저장 되었습니다.'
            }}>
            <span className='mobile-number-to-copy'>010-9539-8700</span>
          </CopyToClipboard>

          <p className='helper info inquiry-info mt-40 mb-20'>
            <span className='text-bg-black has-text-bold inline-small-padding'>문자</span>로만 연락 부탁드립니다.
          </p>

          <button className='is-secondary'
            type='button'
            onClick={() => navigate('/booking/counsel-option')}>예약 홈으로</button>
        </div>
      </div>
    </PageTemplate>
  )
}
