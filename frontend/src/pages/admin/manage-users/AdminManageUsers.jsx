import React, { useState, useMemo } from 'react'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'
import StateButton from '@components/state-button/StateButton'
import CopyToClipboard from '@components/copy-to-clipboard/CopyToClipboard'

// utils
import {
  humanDate,
  classNames as cn
} from '@utils'

// hooks
import { useGetAllUsers } from '@store/features/usersApiSlice.js'

// css
import './AdminManageUsers.scss'

// helpers
const transformDataEntry = entry => {
  const getUserTypeDisplay = val => ({
    'admin-owner': '주인장',
    'admin-staff': '스텝'
  })[val]

  const r = {
    email: entry.email,
    userType: entry.userType,
    userTypeDisplay: getUserTypeDisplay(entry.userType),
    isPermitted: entry.isPermitted,
    createdAt: entry.createdAt,
    id: entry._id,
    createdAtDisplay: humanDate(entry.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })
  }
  r.searchable = `${r.email}__${r.userTypeDisplay}__${r.createdAtDisplay}`
  return r
}

export default function AdminManageUsers () {
  // local-state
  const [search, setSearch] = useState('')
  const {
    data: usersData,
    isLoading: isUsersLoading,
    isError: isUsersError,
    refetch
  } = useGetAllUsers()

  // computed state
  const dataToDisplay = useMemo(
    () => {
      if (Array.isArray(usersData)) {
        return usersData.map(transformDataEntry)
      } else {
        return null
      }
    }, [usersData, search]
  )

  if (usersData) {
    console.log('@@@ usersData: ', usersData)
  }

  // methods
  const onPermitClick = () => {
    alert('Coming soon!')
  }

  // views
  const feedbackEl = isUsersLoading
    ? <div className='admin-feedback-container'>
        <TextLoader>
          유저 데이터 로딩중...
        </TextLoader>
      </div>
    : isUsersError
      ? <Feedback type='error' classes='mt-20' showError={true}>
          유저 데이터 로드중 오류가 발생했습니다.
        </Feedback>
      : null

  return (
    <AdminPageTemplate classes='page-admin-manage-users'>
      <div className='admin-manage-users-wrapper'>
        <h2 className='admin-page-title'>
          <i className='icon-group is-prefix'></i>
          <span>유저 관리</span>
        </h2>

        {
          feedbackEl ||
          <>
            <div className='search-input-container mb-20'>
              <div className='input-with-pre-icon'>
                <i className='icon-search pre-icon'></i>

                <input className='input admin-search-input'
                  type='text'
                  value={search}
                  onInput={e => setSearch(e.target.value)} />
              </div>
            </div>

            <div className='ilwol-table-container users-list-table'>
              <div className='ilwol-table-inner'>
                <table className='ilwol-table'>
                  <thead>
                    <tr>
                      <th className='th-email'>이메일</th>
                      <th className='th-type'>유저 타입</th>
                      <th className='th-status'>승인/대기</th>
                      <th className='th-created-date'>생성 날짜</th>
                      <th className='th-action'></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      dataToDisplay.map((entry) => {
                        return (
                          <tr>
                            <td className='td-email'>
                              <CopyToClipboard classes='email-copy'
                                textToCopy={entry.email}
                                toastOpt={{
                                  heading: '이메일 복사',
                                  content: '클립보드에 저장 되었습니다.'
                                }}>
                                {entry.email}
                              </CopyToClipboard>
                            </td>
                            <td className='td-type'>{entry.userTypeDisplay}</td>
                            <td className='td-status'>
                              <span className={cn('inline-small-padding', entry.isPermitted ? 'text-bg-success' : 'text-bg-validation')}>
                                { entry.isPermitted ? '승인' : '대기' }
                              </span>
                            </td>
                            <td className='td-created-date'>{entry.createdAtDisplay}</td>
                            <td className='td-action'>
                              <span className='cta-container'>
                                {
                                  !entry.isPermitted &&
                                  <button className='is-primary is-table-btn'
                                    onClick={onPermitClick}>승인</button>
                                }
                              </span>
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </>
        }
      </div>
    </AdminPageTemplate>
  )
}
