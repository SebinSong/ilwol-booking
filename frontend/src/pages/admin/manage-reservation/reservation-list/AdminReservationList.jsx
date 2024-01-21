import React, { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

// components
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'
import AdminReservationTable from '../admin-reservation-table/AdminReservationTable'
import AccordionButton from '@components/accordion/accordion-button/AccordionButton'

// hooks
import { useGetAdminReservations } from '@store/features/adminApiSlice.js'

// utils
import { dateObjToNumeric } from '@utils'
const combineMoblie = mobile => `${mobile.prefix}-${mobile.number.slice(0, 4)}-${mobile.number.slice(4)}`

export default function AdminReservationList () {
  const navigate = useNavigate()
  // local-state
  const [getReservations, {
    data,
    isLoading: isLoadingReservations,
    isError: isReservationError
  }] = useGetAdminReservations()

  // computed state
  const cancelledData = useMemo(
    () => Array.isArray(data) ? data.filter(entry => entry.status === 'cancelled') : [],
    [data]
  )
  const pendingData = useMemo(
    () => Array.isArray(data) ? data.filter(entry => entry.status === 'pending') : [],
    [data]
  )
  const confirmedData = useMemo(
    () => Array.isArray(data) ? data.filter(entry => entry.status === 'confirmed') : [],
    [data]
  )

  // effects
  useEffect(() => {
    loadReservationData()
  }, [])

  // methods
  const loadReservationData = async () => {
    try {
      await getReservations({ from: dateObjToNumeric(new Date()) })
    } catch (err) {
      console.error('AdminManageReservation.jsx caught: ', err)
    }
  }

  const onSendMsgClick = () => {
    const mobileNumArr = pendingData
      .map(x => x.personalDetails?.mobile?.number ? combineMoblie(x.personalDetails.mobile) : '')
      .filter(Boolean)

    navigate(
      '/admin/send-message',
      { 
        state: { 
          to: mobileNumArr,
          autoMsg: `안녕하세요.\r\n예약 신청 접수가 완료 되었습니다.\r\n예약확정 및 노쇼방지를 위해 익일까지 입금주시도록 운영하고 있어요. 양해를 부탁드립니다. ^^\r\n\r\n감사합니다!\r\n즐거운 하루 되세요~! ^^♡`
        }
      }
    )
  }

  const feedbackEl = isLoadingReservations
    ? <div className='admin-feedback-container'>
        <TextLoader>
          예약 데이터 로딩중...
        </TextLoader>
      </div>
    : isReservationError
        ? <Feedback type='error' classes='mt-20' showError={true}>
            예약 데이터 로드중 에러가 발생하였습니다.
          </Feedback>
        : null

  if (feedbackEl) { return feedbackEl }
  else {
    return (
      <>
        <section className='admin-page-section mb-40 pb-0'>
          <AdminReservationTable
            list={pendingData}
            emptyMessage='해당 데이터가 없습니다.'
            toggleBtnText='확정 대기중인 예약'
            toggleBtnType='default'>
            <button className='is-secondary is-small' type='button'
              onClick={onSendMsgClick}>
              <span className='icon-mail is-prefix'></span>
              전체문자 전송
            </button>
          </AdminReservationTable>
        </section>

        <section className='admin-page-section mb-40 pb-0'>
          <AdminReservationTable
            list={confirmedData}
            emptyMessage='해당 데이터가 없습니다.'
            toggleBtnText='확정된 예약'
            toggleBtnType='success' />
        </section>

        <section className='admin-page-section mb-40 pb-0'>
          <AdminReservationTable
            list={cancelledData}
            emptyMessage='해당 데이터가 없습니다.'
            toggleBtnText='취소된 예약'
            toggleBtnType='warning' />
        </section>
      </>
    )
  }
}