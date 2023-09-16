'use strict'

export const BOOKING_STEPS = [
  {
    name: '상담 옵션 선택',
    id: 'counsel-option',
    order: 1,
    linkTo: '/booking/counsel-option'
  },
  {
    name: '날짜/시간 선택',
    id: 'date-and-time',
    order: 2,
    linkTo: '/booking/date-and-time'
  },
  {
    name: '개인 정보 입력',
    id: 'personal-details',
    order: 3,
    linkTo: '/booking/personal-details'
  },
  {
    name: '예약 및 결제',
    id: 'confirm-and-payment',
    order: 4,
    linkTo: '/booking/confirm-and-payment'
  }
]

export const getStepOrder = targetId => {
  const found = BOOKING_STEPS.find(step => step.id === targetId)

  return found ? found.order : 0
}
