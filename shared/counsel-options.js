const COUNSEL_OPTIONS_LIST = [
  {
    name: '개인 상담',
    id: 'individual-counsel',
    type: 'individual',
    description: '개인 학업/취업/미래 운세 및 고민 등을 주제로 신점 상담합니다.',
    duration: 0.5
  },
  {
    name: '가족/커플 상담',
    id: 'family-counsel',
    type: 'group',
    description: '가족/커플 상담입니다. 친구 지인은 제외되고 1인당 5만원 추가입니다.',
    duration: 0.75
  },
  {
    name: '해외 상담',
    id: 'overseas-counsel',
    type: 'individual',
    description: '해외 카카오 보이스톡 신점 상담입니다. 그룹 상담도 가능하며, 1인 추가당 5만원입니다.',
    duration: 0.75
  },
  {
    name: '관리자생성 아이템',
    id: 'admin-generated',
    duration: 0.5
  }
]

// Price tables by version: { [priceVersion]: { [optionId]: { price, additionalPrice } } }.
// The top-level key is the price version, stored on each reservation as `priceVersion`.
// See PRICE_UPDATE.md in this folder before changing prices.
const PRICE_OPTIONS = {
  '1': {
    'individual-counsel': {
      price: 100000,
      additionalPrice: 0
    },
    'family-counsel': {
      price: 150000,
      additionalPrice: 50000
    },
    'overseas-counsel': {
      price: 150000,
      additionalPrice: 50000
    }
  }
}

const CURRENT_PRICE_VERSION = 1

const getCounselOptionsList = (customerFacing = false, version) => {
  version = version || CURRENT_PRICE_VERSION
  let list = COUNSEL_OPTIONS_LIST.map(option => {
    const priceOpts = PRICE_OPTIONS[version]?.[option.id] || {}
    return {
      ...option,
      ...priceOpts
    }
  })

  if (customerFacing) {
    list = list.filter(option => option.id !== 'admin-generated')
  }

  return list
}

export {
  COUNSEL_OPTIONS_LIST,
  CURRENT_PRICE_VERSION,
  getCounselOptionsList
}
