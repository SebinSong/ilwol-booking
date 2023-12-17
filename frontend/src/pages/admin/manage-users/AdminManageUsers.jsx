import React, { useState, useMemo, useContext } from 'react'
import { useSelector } from 'react-redux'

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
import { ToastContext } from '@hooks/useToast.js'
import { useGetAllUsers, usePermitUser, useDeleteUser } from '@store/features/usersApiSlice.js'
import { selectUserInfo } from '@store/features/authDetailsSlice.js'

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
  const { addToastItem } = useContext(ToastContext)

  // local-state
  const [search, setSearch] = useState('')
  const {
    data: usersData,
    isLoading: isUsersLoading,
    isError: isUsersError,
    refetch
  } = useGetAllUsers()
  const [permitUser, {
    isLoading: isPermittingUser,
    isError: permitUserError
  }] = usePermitUser()
  const [deleteUser, {
    isLoading: isDeletingUser,
    isError: deleteUserError
  }] = useDeleteUser()

  const authUserInfo = useSelector(selectUserInfo)
  const isAdminOwner = authUserInfo?.userType === 'admin-owner'

  // computed state
  const dataToDisplay = useMemo(
    () => {
      if (Array.isArray(usersData)) {
        const searchVal = (search || '').trim()
        return usersData.map(transformDataEntry)
          .filter(entry => entry.searchable.includes(searchVal))
      } else {
        return []
      }
    }, [usersData, search]
  )

  // methods
  const onPermitClick = async (user) => {
    if (!window.confirm(`${user.email} 유저를 승인하시겠습니까?`)) { return }

    try {
      const res = await permitUser(user.id).unwrap()
      addToastItem({
        type: 'success',
        heading: '업데이트!',
        content: '해당 유저를 승인하였습니다.'
      })
      refetch()
    } catch (err) {
      addToastItem({
        type: 'warning',
        heading: '실패!',
        content: '유저 업데이트 중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.'
      })
    }
  }

  const onDeleteClick = async (user) => {
    if (!window.confirm(`${user.email} 유저를 삭제하시겠습니까? 한번 삭제된 계정은 복구할 수 없습니다.`)) { return }
  
    try {
      const res = await deleteUser(user.id).unwrap()
      addToastItem({
        type: 'success',
        heading: '계정 삭제됨!',
        content: '해당 계정을 성공적으로 제거하었습니다.'
      })
      refetch()
    } catch (err) {
      addToastItem({
        type: 'warning',
        heading: '실패!',
        content: '유저 삭제 중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.'
      })
    }
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

        <p className='admin-page-description'>관리자 계정들을 한눈에 볼 수 있습니다.</p>

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

            {
              dataToDisplay.length
                ? <div className='ilwol-table-container users-list-table'>
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
                                <tr key={entry.id}>
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
                                  <td className='td-type'>
                                    { 
                                      entry.userType === 'admin-owner' &&
                                      <span className='icon-star'></span>
                                    }
                                    {entry.userTypeDisplay}
                                  </td>
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
                                          disabled={isPermittingUser}
                                          onClick={() => onPermitClick(entry)}>승인</button>
                                      }

                                      {
                                        isAdminOwner && (authUserInfo?.email !== entry.email)
                                          ? <button className='is-warning is-table-btn icon-only'
                                              disabled={isDeletingUser}
                                              onClick={() => onDeleteClick(entry)}>
                                              <i className='icon-trash'></i>
                                            </button>
                                          : null
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
                : <p className='admin-no-data mt-40'>검색/필터 결과가 없습니다.</p>
            }
          </>
        }
      </div>
    </AdminPageTemplate>
  )
}
