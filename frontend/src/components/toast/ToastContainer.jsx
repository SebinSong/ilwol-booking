import React, { useContext, useMemo } from 'react'
import { ToastContext } from '@hooks/useToast.js'
import { classNames as cn } from '@utils'
import Toast from './Toast'

const ToastContainer = () => {
  const {
    toastList,
    removeToastItem,
  } = useContext(ToastContext)

  // computed state
  const isToastEmpty = useMemo(
    () => toastList.length === 0,
    [toastList]
  )

  return (
    <div className={cn('toast-container', isToastEmpty && 'is-empty')}>
      {
        toastList.map(
          item => (
            <Toast key={item.id}
              removeItem={removeToastItem}
              {...item} />
          )
        )
      }
    </div>
  )
}

export default React.memo(ToastContainer)