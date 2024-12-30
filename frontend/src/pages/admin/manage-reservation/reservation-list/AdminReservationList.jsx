import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

// components
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'
import AdminReservationTable from '../admin-reservation-table/AdminReservationTable'
import AccordionButton from '@components/accordion/accordion-button/AccordionButton'

// hooks
import {
  useGetAdminReservations,
  useArchiveOldReservations
} from '@store/features/adminApiSlice.js'

// utils
import { dateObjToNumeric } from '@utils'

// helpers
const combineMoblie = mobile => `${mobile.prefix}${mobile.number}`
const tableProps = {
  'notify-me': {
    emptyMessage: '해당 데이터가 없습니다.',
    toggleBtnText: '조기상담 요망자',
    toggleBtnType: 'default'
  },
  'pending': {
    emptyMessage: '해당 데이터가 없습니다.',
    toggleBtnText: '확정 대기중인 예약',
    toggleBtnType: 'validation'
  },
  'confirmed': {
    emptyMessage: '해당 데이터가 없습니다.',
    toggleBtnText: '확정된 예약',
    toggleBtnType: 'success'
  },
  'on-site-payment': {
    emptyMessage: '해당 데이터가 없습니다.',
    toggleBtnText: '현장지불 예약',
    toggleBtnType: 'purple'
  },
  'cancelled': {
    emptyMessage: '해당 데이터가 없습니다.',
    toggleBtnText: '취소된 예약',
    toggleBtnType: 'warning'
  }
}

export default function AdminReservationList () {
  const navigate = useNavigate()
  // local-state
  const [getReservations, {
    data,
    isLoading: isLoadingReservations,
    isError: isReservationError
  }] = useGetAdminReservations()
  const [_archiveOldReservations, {
    isLoading: isArchiving,
    isError: isArchivingError
  }] = useArchiveOldReservations()
  const [pendingMsgIdList, setPendingMsgIdList] = useState([])
  const [onSitePaymentMsgIdList, setOnSitePaymentMsgIdList] = useState([])
  const [confirmedMsgIdList, setConfirmedMsgIdList] = useState([])

  // computed state
  const notifyMeData =useMemo(
    () => Array.isArray(data) ? data.filter(entry => !!entry.notifyEarlierDate) : [],
    [data]
  )
  const pendingData = useMemo(
    () => Array.isArray(data) ? data.filter(entry => entry.status === 'pending') : [],
    [data]
  )
  const onSitePaymentData = useMemo(
    () => Array.isArray(data) ? data.filter(entry => entry.status === 'on-site-payment') : [],
    [data]
  )
  const confirmedData = useMemo(
    () => Array.isArray(data) ? data.filter(entry => entry.status === 'confirmed') : [],
    [data]
  )
  const cancelledData = useMemo(
    () => Array.isArray(data) ? data.filter(entry => entry.status === 'cancelled') : [],
    [data]
  )

  // effects
  useEffect(() => {
    loadReservationData()
  }, [])

  // methods
  const archiveOldReservations = async () => {
    try {
      await _archiveOldReservations()
    } catch (err) {
      console.error('Failed to archive the old reservations data: ', err)
    }
  }

  const loadReservationData = async () => {
    try {
      await getReservations({ from: dateObjToNumeric(new Date()) })
      archiveOldReservations()
    } catch (err) {
      console.error('AdminManageReservation.jsx caught: ', err)
    }
  }

  const onSendMsgClick = (type = '') => {
    const dataToUse = ({
      pending: pendingData,
      confirmed: confirmedData,
      onSitePayment: onSitePaymentData
    })[type]
    const msgIdList = ({
      pending: pendingMsgIdList,
      confirmed: confirmedMsgIdList,
      onSitePayment: onSitePaymentMsgIdList
    })[type]

    if (!dataToUse || !msgIdList) { return }

    const mobileNumArr = dataToUse
      .filter(x => msgIdList.includes(x._id) && x.personalDetails?.mobile?.number)
      .map(x => combineMoblie(x.personalDetails.mobile))

    navigate(
      '/admin/send-message',
      { 
        state: { 
          to: mobileNumArr,
          autoMsg: type === 'pending'
            ? `안녕하세요.\r\n예약확정, 관리, 노쇼방지를 위해 선입금 또는 현장 지불이신지 답신 부탁드려요. ^^ 답이 없으시면 예약이 취소되세요. [우리은행 심순애 1002 358 833662]\r\n\r\n감사합니다!\r\n즐거운 하루 되세요~! ^^♡`
            : ''
        }
      }
    )
  }

  const onPendingTableSelectionChange = useCallback((list) => {
    setPendingMsgIdList(list)
  }, [])
  const onOnSitePaymentTableSelectionChange = useCallback((list) => {
    setOnSitePaymentMsgIdList(list)
  }, [])
  const onConfirmedTableSelectionChange = useCallback((list) => {
    setConfirmedMsgIdList(list)
  }, [])

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
        {
          notifyMeData?.length > 0 && (
            <section className='admin-page-section mb-30 pb-0'>
              <AdminReservationTable
                showStatus={true}
                list={notifyMeData}
                { ...tableProps['notify-me'] }>
              </AdminReservationTable>
            </section>
          )
        }

        <section className='admin-page-section mb-30 pb-0'>
          <AdminReservationTable
            list={pendingData}
            usetableSelection={true}
            onSelectionChange={onPendingTableSelectionChange}
            { ...tableProps.pending }
          >
            <button className='is-secondary is-small' type='button'
              onClick={() => onSendMsgClick('pending')}
              disabled={!pendingMsgIdList.length}>
              <span className='icon-mail is-prefix'></span>
              전체문자 전송
            </button>
          </AdminReservationTable>
        </section>

        <section className='admin-page-section mb-30 pb-0'>
          <AdminReservationTable
            list={onSitePaymentData}
            usetableSelection={true}
            onSelectionChange={onOnSitePaymentTableSelectionChange}
            { ...tableProps['on-site-payment'] }
          >
            <button className='is-secondary is-small' type='button'
              onClick={() => onSendMsgClick('onSitePayment')}
              disabled={!onSitePaymentMsgIdList.length}>
              <span className='icon-mail is-prefix'></span>
              전체문자 전송
            </button>
          </AdminReservationTable>
        </section>

        <section className='admin-page-section mb-30 pb-0'>
          <AdminReservationTable
            list={confirmedData}
            usetableSelection={true}
            onSelectionChange={onConfirmedTableSelectionChange}
            { ...tableProps.confirmed }
          >
            <button className='is-secondary is-small' type='button'
              onClick={() => onSendMsgClick('confirmed')}
              disabled={!confirmedMsgIdList.length}>
              <span className='icon-mail is-prefix'></span>
              전체문자 전송
            </button>
          </AdminReservationTable>
        </section>

        <section className='admin-page-section mb-30 pb-0'>
          <AdminReservationTable
            list={cancelledData}
            { ...tableProps.cancelled } />
        </section>
      </>
    )
  }
}