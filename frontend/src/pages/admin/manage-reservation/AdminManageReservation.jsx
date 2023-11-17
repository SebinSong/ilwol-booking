import React, { useContext, useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'
import { classNames as cn } from '@utils'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'
import AdminReservationTable from './admin-reservation-table/AdminReservationTable'

// hooks
import { ToastContext } from '@hooks/useToast.js'
import { useGetAdminReservations } from '@store/features/adminApiSlice.js'

import './AdminManageReservation.scss'

export default function AdminManageReservation ({ classes = '' }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { addToastItem } = useContext(ToastContext)

  // local-state
  const [getReservations, {
    data,
    isLoading: isLoadingReservations,
    isError: isReservationError
  }] = useGetAdminReservations()
  const [sectionOpen, setSectionOpen] = useImmer({
    pending: true,
    confirmed: true,
    cancelled: true
  })

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
  const sectionToggleFactory = key => {
    return () => {
      setSectionOpen(draft => {
        draft[key] = !draft[key]
      })
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

  return (
    <AdminPageTemplate classes={cn('page-admin-manage-reservation', classes)}>
      <h2 className='admin-page-title'>
        <i className='icon-bulleted-list is-prefix'></i>
        <span>예약 관리</span>
      </h2>

      {
        feedbackEl ||
        <>
          <section className='admin-page-section mb-0 pb-20'>
            <h3 className='admin-page-section-title is-color-magenta'>
              <i className='icon-clock is-prefix'></i>
              <span>확정 대기중인 예약</span>

              <button className='is-secondary is-small section-toggle-btn'
                onClick={sectionToggleFactory('pending')}>{ sectionOpen.pending ? '숨기기' : '열기' }</button>
            </h3>

            {
              sectionOpen.pending &&
              <AdminReservationTable classes='reservation-list'
                list={pendingData}
                emptyMessage='해당 데이터가 없습니다.' />
            }
          </section>

          <section className='admin-page-section mb-0 pb-20'>
            <h3 className='admin-page-section-title is-color-success'>
              <i className='icon-check-circle is-prefix'></i>
              <span>확정된 예약</span>

              <button className='is-secondary is-small section-toggle-btn'
                onClick={sectionToggleFactory('confirmed')}>{ sectionOpen.confirmed ? '숨기기' : '열기' }</button>
            </h3>

            {
              sectionOpen.confirmed &&
              <AdminReservationTable classes='reservation-list'
                list={confirmedData}
                emptyMessage='해당 데이터가 없습니다.' />
            }
          </section>

          <section className='admin-page-section mb-0 pb-0'>
            <h3 className='admin-page-section-title is-color-warning'>
              <i className='icon-close-circle is-prefix'></i>
              <span>취소된 예약</span>

              <button className='is-secondary is-small section-toggle-btn'
                onClick={sectionToggleFactory('cancelled')}>{ sectionOpen.cancelled ? '숨기기' : '열기' }</button>
            </h3>

            {
              sectionOpen.cancelled &&
              <AdminReservationTable classes='reservation-list'
                list={cancelledData}
                emptyMessage='해당 데이터가 없습니다.' />
            }
          </section>
        </>
      }
    </AdminPageTemplate>
  )
}
