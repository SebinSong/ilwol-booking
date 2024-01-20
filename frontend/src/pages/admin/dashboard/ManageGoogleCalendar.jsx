import React, { useState, useMemo, useContext } from 'react'

// hooks
import { ToastContext } from '@hooks/useToast.js'
import {
  useClearCalendar,
  useRegenerateCalendar
} from '@store/features/adminApiSlice.js'
import { useGetAdminReservations } from '@store/features/adminApiSlice.js'

// child components
import StateButton from '@components/state-button/StateButton'
import LoaderModal from '@components/loader-modal/LoaderModal'

function GoogleCalendarSection ({
  classes = ''
}) {
  const { addToastItem } = useContext(ToastContext)

  // local state
  const [updateStatus, setUpdateStatus] = useState('idle')
  const [clearCalendar, {
    isLoading: isClearingCalendar
  }] = useClearCalendar()
  const [regenerateCalendar, {
    isLoading: isRegeneratingCalendar
  }] = useRegenerateCalendar()
  const [getReservations, {
    data,
    isLoading: isLoadingReservations,
    isError: isReservationError
  }] = useGetAdminReservations()

  // computed state
  const loaderModalOpts = useMemo(() => {
    switch (updateStatus) {
      case 'deleting':
        return {
          showModal: true,
          content: <><span>아이템 삭제 및 초기화 중..</span><br/><span>(오랜 시간이 소요될 수 있습니다)</span></>
        }
      case 'generating':
        return {
          showModal: true,
          content: <><span>모든 예약 아이템 재생성 중..</span><br/><span>(오랜 시간이 소요될 수 있습니다)</span></>
        }
      default:
        return { showModal: false } 
    }
  }, [updateStatus])

  const onSyncButtonClick = async () => {
    if (!window.confirm('캘린더 동기화를 실행하시겠습니까? 캘린더의 모든 현재 데이터가 삭제된 후 재생성 됩니다.')) { return }

    try {
      setUpdateStatus('deleting')
      const res = await clearCalendar()

      setUpdateStatus('generating')
      const resRegen = await regenerateCalendar()

      setUpdateStatus('idle')
      addToastItem({
        type: 'success',
        heading: '캘린더 업데이트',
        content: '구글 캘린더가 성공적으로 동기화 되었습니다. 확인해보세요.'
      })
    } catch (err) {
      console.error('ManageGoogleCalendar.jsx caught: ', err)
      addToastItem({
        type: 'warning',
        heading: '업데이트 오류!',
        content: '쉬는 날 업데이트 중 오류가 발생하였습니다. 다시 시도해 주세요.'
      })
    }

    setUpdateStatus('idle')
  }
  return (
    <section className={`admin-page-section ${classes}`}>
      <h3 className='admin-page-section-title'>
        <i className='icon-chevron-right-circle is-prefix'></i>
        <span>Google Calendar</span>
      </h3>

      <div className='form-field'>
        <span className='label'>캘린더 예약 아이템 동기화:</span>
        <p className='helper info'>
          캘린더를 리셋 후, 관리자 페이지 예약 내역들을 기준으로 구글 캘린더 이벤트들을 새로 업데이트 합니다.<br/>
          조작 실수 등으로 인해 실제 예약 내역과 구글 캘린더 표시 내용이 일치하지 않게 될 때 유용합니다.
        </p>

        <StateButton classes='is-primary mt-20'
          type='button'
          disabled={updateStatus !== 'idle'}
          onClick={onSyncButtonClick}
        >
          <i className='icon-gear is-prefix'></i>
          <span>동기화하기</span>
        </StateButton>
      </div>

      <LoaderModal showModal={loaderModalOpts.showModal}>
        {loaderModalOpts.content}
      </LoaderModal>
    </section>
  )
}

export default React.memo(GoogleCalendarSection)
