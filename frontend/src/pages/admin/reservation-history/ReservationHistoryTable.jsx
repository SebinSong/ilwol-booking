import React, { useState } from 'react'

// components
import Modal from '@components/modal/Modal.jsx'
import HistoryItemSummary from './HistoryItemSummary.jsx'
import CopyToClipboard from '@components/copy-to-clipboard/CopyToClipboard'

// utils
import {
  classNames as cn,
  cloneDeep
} from '@utils'

function ReservationHistoryTable ({
  data = [],
  classes = ''
}) {
  // local-state
  const [showModal, setShowModal] = useState(false)
  const [detailContent, setDetailsContent] = useState(null)

  // methods
  const onItemClick = (entry) => {
    setDetailsContent(entry)
    setShowModal(true)
  }

  return (
    <div className={cn('ilwol-table-container', classes)}>
      <div className='ilwol-table-inner'>
        <table className='ilwol-table'>
          <thead>
            <tr>
              <th className='th-counsel-time'>날짜/시간</th>
              <th className='th-name'>이름</th>
              <th className='th-contact'>연락처</th>
              <th className='th-created-date'>생성 날짜</th>
              <th className='th-status'>상태</th>
              <th className='th-counsel-type'>상담 종류</th>
              <th className='th-action'></th>
            </tr>
          </thead>

          <tbody>
            {
              data?.length
                ? data.map((entry) => {
                    return (
                      <tr key={entry.id}>
                        <td className='td-counsel-time'>{entry.dateAndTime}</td>
                        <td className='td-name' onClick={() => onItemClick(entry)}>{entry.name}</td>
                        <td className='td-contact'>
                          {
                            entry.contact !== 'N/A'
                              ? <CopyToClipboard classes='copy-contact'
                                  textToCopy={entry.contact}>
                                  <span className='copy-contact-value'>{entry.contact}</span>
                                </CopyToClipboard>
                              : entry.contact
                          }
                        </td>
                        <td className='td-created-date'>{entry.createdDate}</td>
                        <td className='td-status'>{entry.status}</td>
                        <td className='td-counsel-type'>{entry.counselType}</td>
                        <td className='td-action'>
                          <button className='is-secondary is-table-btn'
                            onClick={() => onItemClick(entry)}>보기</button>
                        </td>
                      </tr>
                    )
                  })
                : <tr>
                  <td colSpan={6}>
                    <p className='helper info'>보여줄 데이터가 없습니다.</p>
                  </td>
                  </tr>
            }
          </tbody>
        </table>
      </div>

      <Modal classes='reservation-history-details'
        showModal={showModal}
        onCloseClick={() => setShowModal(false)}
        onBackDropClick={() => setShowModal(false)}
        title='예약 상세 내역'
        icon='document'
      >
        <HistoryItemSummary classes='history-details-table' data={detailContent} />
      </Modal>
    </div>
  )
}

export default React.memo(ReservationHistoryTable)
