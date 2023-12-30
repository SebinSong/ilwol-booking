const COUNSEL_OPTIONS_LIST = [
  {
    name: '개인 상담',
    id: 'individual-counsel',
    type: 'individual',
    description: '개인 학업/취업/미래 운세 및 고민 등을 주제로 신점 상담합니다.',
    price: 100000,
    additionalPrice: 0,
    duration: 0.5
  },
  {
    name: '가족/그룹 상담',
    id: 'family-counsel',
    type: 'group',
    description: '본인 포함 2인 이상 상담 옵션입니다. 2인을 기본으로 하며, 1인 추가당 5만원입니다. 가족/커플만 가능하며, 친구 또는 지인은 제외입니다.',
    price: 150000,
    additionalPrice: 50000,
    duration: 1
  },
  {
    name: '해외 상담',
    id: 'overseas-counsel',
    type: 'individual',
    description: '해외 카카오 보이스톡 신점 상담입니다. 그룹 상담도 가능하며, 1인 추가당 5만원입니다.',
    price: 150000,
    additionalPrice: 50000,
    duration: 1
  }
]

export default COUNSEL_OPTIONS_LIST