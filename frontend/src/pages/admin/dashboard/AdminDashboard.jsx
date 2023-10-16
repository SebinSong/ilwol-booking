import React, { useContext, useState, useCallback } from 'react'
import { classNames as cn } from '@utils'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'
import Calendar from '@components/calendar/Calendar'

// hooks
import { ToastContext } from '@hooks/useToast.js'

import './AdminDashboard.scss'

export default function AdminDashboard ({
  classes = ''
}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { addToastItem } = useContext(ToastContext)

  // local-state
  const [dayOffs, setDayOffs] = useState([])

  // methods
  const onCalendarClick = useCallback(
    (val) => {
      setDayOffs(currArr => {
        if (currArr.includes(val)) {
          return currArr.filter(entry => entry !== val)
        } else {
          const newArr = [ ...currArr, val ].sort((a, b) => a - b)
          return newArr
        }
      })
    }, []
  )

  return (
    <AdminPageTemplate classes={cn('page-admin-dashboard', classes)}>
      <h2 className='admin-page-title'>
        <i className='icon-home is-prefix'></i>
        <span>대시보드</span>
      </h2>

      <section className='admin-page-section'>
        <h3 className='admin-page-section-title'>
          <i className='icon-chevron-right-circle is-prefix'></i>
          <span>쉬는 날 정하기</span>
        </h3>

        <Calendar classes='day-off-calendar'
          onChange={onCalendarClick}
          allowMultiple={true}
          value={dayOffs} />
      </section>
    </AdminPageTemplate>
  )
}
