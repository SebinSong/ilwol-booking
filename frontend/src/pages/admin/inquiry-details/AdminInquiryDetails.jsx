import React, { useContext, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'
import CopyToClipboard from '@components/copy-to-clipboard/CopyToClipboard'
import StateButton from '@components/state-button/StateButton'

// hooks
import { useGetInquiryDetails } from '@store/features/inquiryApiSlice.js'
import { ToastContext } from '@hooks/useToast.js'

// utils
import { stringifyDate, humanTimeString, classNames as cn } from '@utils'

import './AdminInquiryDetails.scss'
import { set } from 'mongoose'

// helpers
const displayCreatedAt = createdAt => {
  const dStr = stringifyDate(createdAt)
  const tStr = humanTimeString(createdAt)
  return `${dStr} ${tStr}`
}

export default function AdminInquiryDetails () {
  const navigate = useNavigate()
  const { id: inquiryId } = useParams()
  const { addToastItem } = useContext(ToastContext)

  // local-state
  const {
    data: inquiryData = {},
    isLoading: isLoadingDetails,
    isError: isDetailsError,
    error: detailsError
  } = useGetInquiryDetails(inquiryId)
  const [replyMsg, setReplyMsg] = useState('')

  // methods
  const onReplyButtonClick = () => {
    alert(`Coming soon!`)
  }

  // views
  const feedbackEl = isLoadingDetails
    ? <div className='admin-feedback-container'>
        <TextLoader>
          문의사항 로딩중...
        </TextLoader>
      </div>
    : isDetailsError
      ? <Feedback type='error' classes='mt-20' showError={true}>
          { detailsError?.status === 404 
              ? 'ID에 해당하는 데이터를 찾을 수 없습니다.'
              : '문의사항 아이템 로드중 에러가 발생하였습니다.'
          }
        </Feedback>
      : null

  return (
    <AdminPageTemplate classes='page-admin-inquiry-details'>
      <h2 className='admin-page-title'>
        <i className='icon-chat-bubbles is-prefix'></i>
        <span>문의사항 내용</span>
      </h2>

      <div className='admin-inquiry-details-content'>
        {
          feedbackEl ||
          <>
            <div className='admin-details-call-to-action-container mb-20'>
              <button className='is-secondary is-small'
                onClick={() => navigate(-1)}>
                <i className='icon-chevron-left-circle is-prefix'></i>
                <span>뒤로 가기</span>
              </button>

              <div className='admin-id-copy'>
                <span>문의사항 ID: </span>

                <CopyToClipboard
                  textToCopy={inquiryId}
                  toastOpt={{
                    heading: '문의사항 ID 복사',
                    content: '클립보드에 저장 되었습니다.'
                  }}>
                  <span className='id-display'>{inquiryId}</span>
                </CopyToClipboard>
              </div>
            </div>

            <div className='inquiry-summary-container'>
              <div className='summary-list'>
                <div className='summary-list__title'>
                  <span>문의사항 상세 내용</span>
                </div>

                <div className='summary-list__item'>
                  <span className='summary-list__label'>이름</span>
                  <span className='summary-list__value is-normal-color'>{inquiryData.name}</span>
                </div>

                <div className='summary-list__item'>
                  <span className='summary-list__label'>이메일</span>
                  <span className='summary-list__value is-normal-color'>
                    <CopyToClipboard classes='copy-email'
                      textToCopy={inquiryData.email}
                      toastOpt={{
                        heading: '이메일 복사',
                        content: '클립보드에 저장 되었습니다.'
                      }}>
                      <span>{inquiryData.email}</span>
                    </CopyToClipboard>
                  </span>
                </div>

                <div className='summary-list__item'>
                  <span className='summary-list__label'>제출 날짜/시간</span>
                  <span className='summary-list__value'>{displayCreatedAt(inquiryData.createdAt)}</span>
                </div>

                <div className='summary-list__item horizontal-align-top'>
                  <span className='summary-list__label'>제목:</span>
                  <span className='summary-list__value is-normal-color'>{inquiryData.title}</span>
                </div>

                <div className='summary-list__item is-column'>
                  <span className='summary-list__label'>내용:</span>
                  <p className='inquiry-message-content mt-10'>{inquiryData.message}</p>
                </div>

                <div className='summary-list__item is-column'>
                  <span className='summary-list__label'>답변하기:</span>

                  <form className='inquiry-reply-form'>
                    <textarea type='text' className='textarea'
                      value={replyMsg}
                      onInput={e => setReplyMsg(e.target.value)}
                      placeholder='답변할 내용을 입력해주세요.' />

                    <div className='buttons-container is-right-aligned mt-20 mb-0'>
                      <StateButton classes='is-primary'
                        type='button'
                        disabled={replyMsg.length === 0}
                        onClick={onReplyButtonClick}
                      >답변하기</StateButton>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        }
      </div>
    </AdminPageTemplate>
  )
}
