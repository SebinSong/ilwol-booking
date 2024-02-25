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
import Feedback from '@components/feedback/Feedback'

// hooks
import { ToastContext } from '@hooks/useToast.js'
import { useGetInquiries } from '@store/features/inquiryApiSlice.js'

import './AdminInquiry.scss'

// helpers
const NoDataToShow = () => (
  <div className='no-data-feedback'>
    <i className='icon-close-circle'></i>
    <span>데이터가 없습니다.</span>
  </div>
)

const transformListEntry = entry => {
  const r = {
    title: entry.title,
    name: entry.name,
    email: entry.email,
    date: humanDate(entry.createdAt, { month: 'short', day: 'numeric', year: 'numeric' }),
    id: entry._id,
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
  const {
    data = [],
    isError,
    error,
    isLoading,
    isFetching
  } = useGetInquiries({}, { refetchOnMountOrArgChange: true })
  const isLoadingData = isLoading || isFetching

  // computed state
  const dataToDisplay = useMemo(
    () => {
      return data.map(transformListEntry)
        .filter(entry => entry.searchable.includes(search.trim()))
    }, [data, search]
  )

  // methods
  const navigateToDetails = id => navigate(`/admin/inquiry/${id}`)

  // views
  const feedbackEl = isLoadingData
    ? <div className='admin-feedback-container'>
        <TextLoader>
          문의사항 데이터 로딩중...
        </TextLoader>
      </div>
    : isError
        ? <Feedback type='error' classes='mt-20' showError={true}>
            데이터 로드중 에러가 발생하였습니다.
          </Feedback>
    : !Boolean(data.length)
        ? <div className='admin-feedback-container'>
            <NoDataToShow />
          </div>
        : null

  return (
    <AdminPageTemplate classes={cn('page-admin-inquiry', classes)}>
      <h2 className='admin-page-title'>
        <i className='icon-mail is-prefix'></i>
        <span>고객 문의사항 리스트</span>
      </h2>

      <p className='admin-page-description'>고객 문의사항 내역들을 한눈에 볼 수 있습니다.</p>

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
                                <th className='th-replied'>응답여부</th>
                                <th className='th-action'></th>
                              </tr>
                            </thead>
      
                            <tbody>
                              {
                                dataToDisplay.map((entry) => {
                                  return (
                                    <tr key={entry.searchable}>
                                      <td className='td-title'
                                        onClick={() => navigateToDetails(entry.id)}>{ entry.title }</td>
                                      <td className='td-date'>{ entry.date }</td>
                                      <td className='td-name'>{ entry.name }</td>
                                      <td className='td-email'>{ entry.email }</td>
                                      <td className={cn('td-replied', entry.hasReply ? 'has-reply' : 'no-reply' )}>
                                        <i className={entry.hasReply ? 'icon-check-circle' : 'icon-close-circle'}></i>
                                      </td>
                                      <td className='td-action'>
                                        {
                                          entry.hasReply
                                            ? <button className='is-secondary is-table-btn'
                                                onClick={() => navigateToDetails(entry.id)}>보기</button>
                                            : <button className='is-primary is-table-btn'
                                                onClick={() => navigateToDetails(entry.id)}>답변</button>
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
