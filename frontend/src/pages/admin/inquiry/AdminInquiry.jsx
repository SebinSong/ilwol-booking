import React, { useContext, useState, useMemo } from 'react'
import {
  classNames as cn,
  humanDate
} from '@utils'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'
import TextLoader from '@components/text-loader/TextLoader'

// hooks
import { ToastContext } from '@hooks/useToast.js'
import { useGetInquiries } from '@store/features/inquiryApiSlice.js'

import './AdminInquiry.scss'

// helpers
const NoDataToShow = () => (
  <div className='no-data-feedback'>
    <i className='icon-close-circle'></i>
    <span>보일 데이터가 없습니다.</span>
  </div>
)
const transformListEntry = entry => {
  const r = {
    title: entry.title,
    name: entry.name,
    email: entry.email,
    date: humanDate(entry.createdAt, { month: 'short', day: 'numeric', year: 'numeric' }),
    hasReply: Array.isArray(entry.replies) && entry.replies.some(reply => Boolean(reply.repliedAt))
  }
  r.searchable = `${r.title}-${r.name}-${r.email}-${r.date}`

  return r
}

export default function AdminInquiry ({ classes = '' }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { addToastItem } = useContext(ToastContext)

  // local-state
  const [search, setSearch] = useState('')
  const [queryArgs, setQueryArgs] = useState({})
  const {
    data = [],
    isLoading,
    isFetching
  } = useGetInquiries(queryArgs)
  const isLoadingData = isLoading || isFetching

  // computed state
  const dataToDisplay = useMemo(
    () => {
      return data.map(transformListEntry)
        .filter(entry => entry.searchable.includes(search.trim()))
    }, [data, search]
  )

  const feedbackEl = isLoadingData
    ? <div className='inquiry-feeback'>
        <TextLoader>
          문의사항 데이터 로딩중...
        </TextLoader>
      </div>
    : !Boolean(data.length)
        ? <div className='inquiry-feeback'>
            <NoDataToShow />
          </div>
        : null

  return (
    <AdminPageTemplate classes={cn('page-admin-inquiry', classes)}>
      <h2 className='admin-page-title'>
        <i className='icon-mail is-prefix'></i>
        <span>고객 문의사항</span>
      </h2>

      <div className='page-admin-inquiry-content'>
        {
          feedbackEl
            ? feedbackEl
            : <>
                <div className='search-input-container'>
                  <div className='input-with-pre-icon'>
                    <i className='icon-search pre-icon'></i>

                    <input className='input inquiry-search-input'
                      type='text'
                      value={search}
                      onInput={e => setSearch(e.target.value)} />
                  </div>
                </div>

                {
                  !dataToDisplay.length
                    ? <div className='inquiry-feeback'>
                        <NoDataToShow />
                      </div>
                    : <div className='ilwol-table-container inquiry-list-table'>
                        <div className='ilwol-table-inner'>
                          <table className='ilwol-table'>
                            <thead>
                              <tr>
                                <th className='th-title'>제목</th>
                                <th className='th-date'>날짜</th>
                                <th className='th-name'>이름</th>
                                <th className='th-email'>이메일</th>
                                <th className='th-replied'>답변됨</th>
                                <th className='th-action'></th>
                              </tr>
                            </thead>
      
                            <tbody>
                              {
                                dataToDisplay.map(entry => {
                                  return (
                                    <tr>
                                      <td className='td-title'>{ entry.title }</td>
                                      <td className='td-date'>{ entry.date }</td>
                                      <td className='td-name'>{ entry.name }</td>
                                      <td className='td-email'>{ entry.email }</td>
                                      <td className={cn('td-replied', entry.hasReply ? 'has-reply' : 'no-reply' )}>
                                        <i className={entry.hasReply ? 'icon-check-circle' : 'icon-close-circle'}></i>
                                      </td>
                                      <td className='td-action'>
                                        {
                                          entry.hasReply
                                            ? <button className='is-secondary is-table-btn'>보기</button>
                                            : <button className='is-primary is-table-btn'>답변</button>
                                        }
                                        
                                      </td>
                                    </tr>
                                  )
                                })
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                }
              </>
        }
      </div>
    </AdminPageTemplate>
  )
}
