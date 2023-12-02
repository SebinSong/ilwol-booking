import React, { useContext, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'
import CopyToClipboard from '@components/copy-to-clipboard/CopyToClipboard'
import StateButton from '@components/state-button/StateButton'

// hooks
import { useGetReservationDetails } from '@store/features/reservationApiSlice.js'
import { useUpdateReservationDetails } from '@store/features/adminApiSlice.js'
import { ToastContext } from '@hooks/useToast.js'

export default function AdminUpdateReservationItem () {
  const navigate = useNavigate()
  const { id: reservationId } = useParams()
  const { addToastItem } = useContext(ToastContext)

  // local-state
  const {
    data = {},
    isLoading: isLoadingDetails,
    isError: isDetailsError,
    refetch
  } = useGetReservationDetails(reservationId)
  const [
    updateReservationDetails,
    {
      isLoading: isUpdatingReservationDetails,
      isError: isReservationDetailsError
    }
  ] = useUpdateReservationDetails()

  // computed state
  const pDetails = data?.personalDetails || {}

  // methods
  const updateReservationDetails = async () => {

  }

  // views
  const feedbackEl = isLoadingDetails
    ? <div className='admin-feedback-container'>
        <TextLoader>
          예약 아이템 로딩중...
        </TextLoader>
      </div>
    : isDetailsError
      ? <Feedback type='error' classes='mt-20' showError={true}>
          예약 아이템 로드중 에러가 발생하였습니다.
        </Feedback>
      : null

  return (
    <AdminPageTemplate classes='page-admin-update-reservation-item'>
      <h2 className='admin-page-title'>
        <i className='icon-clock is-prefix'></i>
        <span>예약 항목 수정</span>
      </h2>

      <div className='admin-reservation-item-content'>
        {
          feedbackEl ||
          <>
            <div className='admin-details-call-to-action-container'>
              <button className='is-secondary is-small'
                onClick={() => navigate('/admin/manage-reservation')}>
                <i className='icon-chevron-left-circle is-prefix'></i>
                <span>예약 리스트 보기</span>
              </button>

              <div className='admin-id-copy'>
                <span>예약 ID: </span>

                <CopyToClipboard
                  textToCopy={reservationId}
                  toastOpt={{
                    heading: '예약 ID 복사',
                    content: '클립보드에 저장 되었습니다.'
                  }}>
                  <span className='id-display'>{reservationId}</span>
                </CopyToClipboard>
              </div>
            </div>
          </>
        }
      </div>
    </AdminPageTemplate>
  )
}