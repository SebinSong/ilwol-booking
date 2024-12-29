import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// utils
import { uniq, debounce } from '@utils'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'
import ContactLine from './contact-line/ContactLine'
import ContactActions from './contact-actions/ContactActions'

// hooks
import { useGetAllContacts } from '@store/features/adminApiSlice.js'
import { storeSelectedContacts, selectStoredSelectedContacts } from '@store/features/customerContactsSlice.js'

// helpers
const sortTypeList = [
  { id: 'created-date', name: '생성날짜순', value: 'created-date' },
  { id: 'alphabetical', name: '가나다순', value: 'alphabetical' }
]

import './AdminCustomerContact.scss'

export default function AdminCustomerContact () {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // local-state
  const {
    data: contactData,
    isLoading: isContactsLoading,
    isError: isContactsError,
    refetch
  } = useGetAllContacts()
  const storedCustomerContacts = useSelector(selectStoredSelectedContacts)
  const [sortType, setSortType] = useState('created-date')
  const [search, setSearch] = useState('')
  const [selectedItems, setSelectedItems] = useState([]) // list of Ids of the selected items

  // computed state
  const feedbackEl = useMemo(
    () => {
      const content = (isContactsLoading)
        ? <TextLoader>연락처 데이터 로딩중..</TextLoader>
        : isContactsError
          ? <Feedback type='error'
                showError={true}
                hideCloseBtn={true} 
                message='연락처 데이터 로드중 오류가 발생했습니다.' />
          : null

      return content
        ? <div className='admin-feedback-container'>{content}</div>
        : null
    },
    [isContactsLoading, isContactsError]
  )
  const dataToShow = useMemo(
    () => {
      const list = (contactData || []).filter(entry => entry.searchable.includes(search))

      if (sortType === 'created-date') {
        list.sort((a, b) => (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      }

      return list
    },
    [contactData, search, sortType]
  )

  // methods
  const onItemSelect = useCallback(
    (data) => {
      setSelectedItems(si => {
        let updatedList

        if (si.includes(data._id)) {
          updatedList = si.filter(x => x !== data._id)
        } else {
          updatedList = [ ...si, data._id ]
        }

        return updatedList
      })
    },
    []
  )

  const onContactDeletion = useCallback(() => refetch(), [])

  const onSearchInputDebounced = useCallback(
    debounce(e => setSearch(e.target.value), 300), []
  )

  const onClearList = useCallback(
    () => setSelectedItems([]), []
  )

  const onSelectAll = useCallback(
    () => {
      const allSelections = dataToShow.map(entry => entry._id)
      setSelectedItems(allSelections)
    }, [dataToShow]
  )

  const sendGroupMessages = () => {
    if (!selectedItems?.length) { return }

    const allContacts = contactData
    const adjustedContacts = []
    for (const selectedId of selectedItems) {
      const found = allContacts.find(x => x._id === selectedId)

      if (found) {
        adjustedContacts.push(found.contact.replace(/\s+/g, ''))
      }
    }

    dispatch(storeSelectedContacts(selectedItems))

    navigate(
      '/admin/send-message',
      {
        state: {
          to: uniq(adjustedContacts),
          isFromCustomerContact: true
        }
      }
    )
  }

  // effects
  useEffect(() => {
    if (storedCustomerContacts?.length) {
      setSelectedItems(storedCustomerContacts.slice())
    }
  }, [])

  return (
    <AdminPageTemplate classes='page-admin-customer-contact'>
      <div className='page-width-constraints'>
        <h2 className='admin-page-title'>
          <i className='icon-id-card is-prefix'></i>
          <span>고객 연락처</span>
        </h2>

        <p className='admin-page-description'>예약 사이트 이용자들의 연락처 정보를 조회합니다.</p>

        <div className='admin-customer-contact__content'>
          {
            feedbackEl ||
            <>
              {
                contactData?.length > 0
                  ? <>
                      <div className='search-bar-container'>
                        <div className='input-with-pre-icon'>
                          <i className='icon-search pre-icon'></i>

                          <input className='input is-small search-input'
                            type='text'
                            placeholder='이름 또는 번호 입력'
                            onInput={onSearchInputDebounced} />
                        </div>

                        <span className='selectbox is-small sort-select-el'>
                          <select className='select'
                            tabIndex='0'
                            value={sortType}
                            data-vkey='table-sort'
                            onChange={e => setSortType(e.target.value)}>
                            {
                              sortTypeList.map(entry => (
                                <option value={entry.value} key={entry.id}>{entry.name}</option>
                              ))
                            }
                          </select>
                        </span>
                      </div>

                      <div className='load-info-box'>
                        <p className='contact-load-info'>
                          <span><span className='has-text-bold text-color-purple mr-2'>{contactData.length}</span>개의 연락처</span>
                          
                          <div className='selection-ctas'>
                            <button className='is-secondary is-extra-small' onClick={onSelectAll}>
                              <i className='icon-plus-circle is-prefix'></i>
                              전체 선택
                            </button>

                            {
                              Boolean(selectedItems?.length) &&
                              <button className='is-warning is-extra-small' onClick={onClearList}>
                                <i className='icon-close-circle is-prefix'></i>
                                전체 취소
                              </button>
                            }
                          </div>
                        </p>
                      </div>

                      <div className='admin-contact-list'>
                        {
                          dataToShow.length > 0
                            ? dataToShow.map(entry => <ContactLine data={entry} key={entry._id}
                                searchValue={search}
                                selected={selectedItems.includes(entry._id)}
                                onSelect={onItemSelect}
                                onDelete={onContactDeletion}
                              />)
                            : <p className='helper info mt-0 no-result'>검색결과가 없습니다.</p>
                        }
                      </div>
                    </>
                  : <p className='helper info'>로드된 데이터가 없습니다.</p>
              }
            </>
          }
        </div>

        {
          !isContactsLoading && !isContactsError &&
          <ContactActions selectCount={selectedItems?.length || 0}
            onClear={onClearList}
            onSend={sendGroupMessages} />
        }
      </div>
    </AdminPageTemplate>
  )
}
