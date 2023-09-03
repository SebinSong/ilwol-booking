'use strict'

export const BOOKING_STEPS = [
  {
    name: '상담 옵션',
    id: 'counsel-option',
    order: 1
  },
  {
    name: '날짜 및 개인정보',
    id: 'date-and-personal-details',
    order: 2
  },
  {
    name: '결제',
    id: 'payment',
    order: 3
  },
  {
    name: '내역 확인',
    id: 'confirmation',
    order: 4
  }
]

export const getStepOrder = targetId => {
  const found = BOOKING_STEPS.find(step => step.id === targetId)

  return found ? found.order : 0
}
