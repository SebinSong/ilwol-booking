import React, { useEffect, useMemo } from 'react'

// components
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'
import AdminReservationTable from '../admin-reservation-table/AdminReservationTable'
import AccordionButton from '@components/accordion/accordion-button/AccordionButton'

// hooks
import { useGetAdminReservations } from '@store/features/adminApiSlice.js'

export default function AdminReservationList () {
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
      await getReservations()
    } catch (err) {
      console.error('AdminManageReservation.jsx caught: ', err)
    }
  }

  const feedbackEl = isLoadingReservations
    ? <div className='admin-feeback-container'>
        <TextLoader>
          예약 데이터 로딩중...
        </TextLoader>
      </div>
    : isReservationError
        ? <Feedback type='error' classes='mt-20'>
            예약 데이터 로드중 에러가 발생하였습니다.
          </Feedback>
        : null

  if (feedbackEl) { return feedbackEl }
  else {
    return (
      <>
        <section className='admin-page-section mb-20 pb-20'>
          <AdminReservationTable
            list={pendingData}
            emptyMessage='해당 데이터가 없습니다.'
            toggleBtnText='확정 대기중인 예약'
            toggleBtnType='default' />
        </section>

        <section className='admin-page-section mb-20 pb-20'>
          <AdminReservationTable
            list={confirmedData}
            emptyMessage='해당 데이터가 없습니다.'
            toggleBtnText='확정된 예약'
            toggleBtnType='success' />
        </section>

        <section className='admin-page-section mb-20 pb-0'>
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