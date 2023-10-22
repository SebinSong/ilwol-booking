import { createContext, useState, useRef } from 'react'
import { genId } from '@utils'

export const ToastContext = createContext({})
export const TOAST_DEFAULT_DURATION = 3500

export function useToast (initList = []) {
  const [toastList, setToastList] = useState(initList)
  const timeoutIdMap = useRef({})

  const isToastActive = () => toastList.length > 0

  const removeToastItem = id => {
    setToastList(
      prevList => prevList.filter(item => item.id !== id)
    )

    const timeoutId = timeoutIdMap.current[id]
    if (timeoutId) {
      clearTimeout(timeoutId)
      delete timeoutIdMap.current[id]
    }
  }

  const unloadAllToast = () => {
    const ids = (toastList || []).map(entry => entry.id)
    ids.forEach(id => removeToastItem(id))
  }

  const addToastItem = ({
    type = 'info',
    heading = '',
    content = '',
    hideClose = false,
    delay = null
  }, unloadFirst = false) => {
    if (unloadFirst) { unloadAllToast() }

    const itemId = genId()
    setToastList(prevList => {
      if (prevList.length === 3) { prevList.shift() }
      return [
        ...prevList,
        {
          id: itemId,
          type,
          heading,
          content,
          hideClose
        }
      ]
    })

    const timeoutId = setTimeout(
      () => removeToastItem(itemId),
      (typeof delay === 'number') ? delay : TOAST_DEFAULT_DURATION
    )

    timeoutIdMap.current[itemId] = timeoutId
    return itemId
  }

  return {
    toastList,
    isToastActive,
    addToastItem,
    removeToastItem,
    unloadAllToast
  } 
}
