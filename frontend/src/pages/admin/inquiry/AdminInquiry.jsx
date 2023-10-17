import React, { useContext, useState } from 'react'
import { classNames as cn } from '@utils'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'

// hooks
import { ToastContext } from '@hooks/useToast.js'
import { useGetInquiries } from '@store/features/inquiryApiSlice.js'

import './AdminInquiry.scss'

export default function AdminInquiry ({ classes = '' }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { addToastItem } = useContext(ToastContext)

  // local-state
  const [queryArgs, setQueryArgs] = useState({ page: 0, limit: 3 })
  const {
    data = [],
    isLoading,
    isFetching
  } = useGetInquiries(queryArgs)

  // methods
  const loadData = async () => {
    try {
      setQueryArgs({ page: 1, limit: 4 })
    } catch (e) {
      console.error('error caught while fetching inquiry data: ', e)
    }
  }

  return (
    <AdminPageTemplate classes={cn('page-admin-inquiry', classes)}>
      <h2 className='admin-page-title'>
        <i className='icon-mail is-prefix'></i>
        <span>고객 문의사항</span>
      </h2>

      <p>
        { isFetching ? <span>Loading...</span> : <span>{data.length} inquiries fetched.</span> }
      </p>

      <div className='buttons-container'>
        <button className='is-primary'
          type='button'
          disabled={isFetching}
          onClick={loadData}>데이터 로드</button>
      </div>
    </AdminPageTemplate>
  )
}
