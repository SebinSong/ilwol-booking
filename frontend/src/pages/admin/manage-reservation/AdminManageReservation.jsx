import React, { useContext, useEffect } from 'react'
import { classNames as cn } from '@utils'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'

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

  return (
    <AdminPageTemplate classes={cn('page-admin-manage-reservation', classes)}>
      <h2 className='admin-page-title'>
        <i className='icon-bulleted-list is-prefix'></i>
        <span>예약 관리</span>
      </h2>

      {
        feedbackEl ||
        <>
          <section className='admin-page-section'>
            <p>{`${data?.length || 0} 건의 예약 데이터가 로드되었습니다.`}</p>
          </section>
        </>
      }
    </AdminPageTemplate>
  )
}
