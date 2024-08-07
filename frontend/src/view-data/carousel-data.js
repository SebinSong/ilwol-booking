import { genId, humanDate } from '@utils'

const displayDate = str => humanDate(str, { month: 'short', day: 'numeric', year: 'numeric' })

export const testimonials = [
  {
    id: genId(),
    type: 'visit-review',
    name: "김지* 님",
    date: '2024년 7월',
    content: '안녕하세요 선생님. 오늘 상담해주셔서 많은 위안이 되었습니다. 힘든 시간이었는데, 앞으로 잘 극복해보도록 하겠습니다. 진심으로 감사합니다.'
  },
  {
    id: genId(),
    type: 'youtube-feedback',
    name: "아이디 'jenas**' 님",
    date: '2024년 6월',
    content: '몇해전에 선생님 뵙고 마음이 정말 좋았거든요. 제 딴에 존경하는 마음 담아 인사도 올리고, 케익도 올리고 와서 그런지 요새도 한번 걸음해볼까 생각이 들기도 합니다!<br/>' +
     '다시 영상보게 되어 좋아요! 말씀 정말 잘하시는 것 같아요, 위안이 됩니다.<br/>아이는 낳으라 하셨었는데 도전중에 있는 일이 있어서 어렵네요ㅜ 영상보니깐 선생님이 해주셨던 말씀이 더 생각나요.'
  },
  {
    id: genId(),
    type: 'visit-review',
    name: '유진* 님',
    date: '2024년 6월',
    content: '말씀해주신대로 월별운이 정말 잘 맞으시네요! 진짜 소개팅이 들어와서 나가니 맘에 드는 한살 어린 여자애가 나타나네요! 이번주 금요일에 또 만나요!! 후기 말씀드리려구요ㅋㅋ'
  },
  {
    id: genId(),
    type: 'visit-review',
    name: '문덕* 님',
    date: '2024년 6월',
    content: '초 켜주시고 기도해주신 덕에 딸이 많이 변했습니다. 고맙습니다.'
  },
  {
    id: genId(),
    name: '김지* 님',
    type: 'visit-review',
    date: displayDate('2024-04-09'),
    content: '선생님 안녕하세요~<br/>오늘 신규 근무지 배치가 완료됐는데, 정말 광주가 됐네요..^^ 너무 신기해서 알려드리려고 연락드려요.<br/>그 전에 광주가 1번, 운 좋으면 용인이 2번이라고 말씀해 주셨었는데..<br/>딱 한자리 있었는데 신기하네요. 슬슬 무섭습니다ㅎㅎ'
  },
  {
    id: genId(),
    name: '성함 비공개 님',
    type: 'visit-review',
    date: displayDate('2024-04-09'),
    content: '안녕하세요~ <br/>소개받고 문의 드리는데, 시기를 그렇게 잘 맞추신다고.. 지인의 지인분의 또 다른 지인분까지 보살님께 상담받고 시기가 너무 정확하다고 추천해 주셨거든요 ㅎㅎ<br/>저의 취업/재회/결혼 관련해서 상담받고 싶습니다.<br/>(중략...)'
  },
  {
    id: genId(),
    name: "아이디 'layla55**' 님",
    type: 'youtube-feedback',
    date: displayDate('2024-04-04'),
    content: '해달별쌤은~ 예쁘시고 말도 우아~하게 잘하시고 점도 디테일하게 봐주시는데, 시간이 흐르고 되돌아보믄.. 너무 잘맞아 소오름! 항상 감사드리며 응원합니데 :)'
  },
  {
    id: genId(),
    name: '위연* 님',
    type: 'visit-review',
    date: displayDate('2024-04-02'),
    content: '선생님~ 지난번에 보내주신 노트보면서 감사하고~ 항상 충전하고 있어요!!<br/>재수 금전 영업이 굳입니다요!!'
  },
  {
    id: genId(),
    type: 'youtube-feedback',
    name: "아이디 '나여*' 님",
    date: '2024년 1월',
    content: '단언컨데 영상으로 보는것보다 실제 점사는 진짜 소름끼치도록 잘 맞아서 내 인생 최고의 신점을 들었다고 느꼈음.<br/>매우 미인이시면서 상업적인 냄새 없고 인간적인 분이심. 월드컵 점사는 그 중 매우 일부. 진짜 잘보셔요.'
  },
  {
    id: genId(),
    name: '배주* 님',
    type: 'visit-review',
    date: displayDate('2023-10-25'),
    content: '올해 여름에 다녀갔었는데 변리사 최종합격했습니다. 불안할때마다 상담 녹음파일 들으며 버텼습니다.<br/>감사합니다.'
  },
  {
    id: genId(),
    type: 'visit-review',
    name: '가수 고규* 님',
    date: '2023년 상반기',
    content: '선생님 기운받구 자심감 뿜뿜 얻구 갑니다! 잘되서 올해안에 꼭 다시갈게요!<br/>진심으로 감사드립니다. 속이 뻥뚫렸어요 최고!'
  },
  {
    id: genId(),
    type: 'youtube-feedback',
    name: "아이디 'yess**' 님",
    date: '2022년 하반기',
    content: '유튜브보고 끌려서 봤는데, 영상보고 느꼈던 것처럼, 제가 말하지 않아도 가족부터 성격까지 정확하게 맞추셔서 진짜 소름돋았어요.<br/>인생 처음 본 신점이었는데, 궁금하고 답답했던 것 시원시원하게 콕콕 답 내려주셔서 걱정 다 풀리고 왔습니다.<br/>이제 구독자로서 응원하겠습니당 ㅎㅎㅎ'
  },
  {
    id: genId(),
    type: 'youtube-feedback',
    name: '아이디 비공개',
    date: '2022년 하반기',
    content: '생년월일도 안물어보시고, 그냥 보이시는대로 촤르르 너무 다 맞추시고, 저만 알고있는 걸 콕 찝어 말씀해주셔서 신기하고 정말 놀랬고, 고생 많았다고 잘되려는 과정이라고 해주신 말씀이 정말 큰 위로가 되었습니다.<br/>과거, 현재, 미래 말씀해주신 것들 하나하나 가슴 깊이 담아두고, 지금처럼 열정적으로 화통하게 잘 살아보겠습니다!<br/>살다가 공수 말씀해주신거 느껴보고 또 1년뒤에 찾아뵐게요. 진심어린 상담과 조언 정말로 감사드려요!!'
  },
  {
    id: genId(),
    type: 'visit-review',
    name: '박경* 님',
    date: '2022년 하반기',
    content: '오늘 얼굴뵈어 넘 반갑고 소중한 시간이었어요~<br/>딸과 함께한 상담! 많은 것들을 얻고 돌아왔습니다. 진심은 통한다고 했지요? 선녀님의 진심어린 말씀에 감동감동! 앞으로 삶을 살아가는 자세 태도에 대한 가르침의 시간이었습니다.<br/>23년 12월 예약완료!! 내년 12월에 뵈어요~'
  }
]

export const youtubeData = [
  {
    id: genId(),
    title: "선녀님의 영화 '파묘' 감상평",
    description: "무속을 주제로 한 2024년 국내 천만관객 영화 '파묘' 에 대해 얘기를 해보았습니다. " +
      "현직 무당으로써 느낀 감상평 및, 무속 전문가에게서만 들을 수 있는 중요 포인트에 대한 해설을 해주시는 흥미로운 영상입니다. 채널의 가장 인기 컨텐츠 중 하나입니다!",
    imgSrc: 'https://img.youtube.com/vi/C52vu9F-cuk/0.jpg',
    url: 'https://youtu.be/C52vu9F-cuk'
  },
  {
    id: genId(),
    title: "어도어 '민희진' 대표의 사주 분석",
    description: "그룹 뉴진스의 제작자이자 어머니로 불리는 민희진 대표의 사주 풀이에 대한 영상입니다. 하이브 그룹과의 분쟁은 어떤식으로 진행될 지, 민대표의 향후 미래는 어떠한 모습일 지에 관한 선녀님의 흥미로운 분석입니다.",
    imgSrc: 'https://img.youtube.com/vi/vdEfaLyxPEY/0.jpg',
    url: 'https://youtu.be/vdEfaLyxPEY'
  },
  {
    id: genId(),
    title: "죽음을 앞둔 사람은 무당한테 어떻게 보일까?",
    description: "2023년 말 세상을 떠난 배우 '이선균'씨 사건을 맞아, 죽음을 주제로 선녀님과 대화를 해보았습니다. 생과 사를 스스로 결정하는 일에 대하여, 신을 모시는 일을 오래 해오신 무속 전문가의 심도깊은 견해를 주십니다.",
    imgSrc: 'https://img.youtube.com/vi/Jb3BRj37mAo/0.jpg',
    url: 'https://youtu.be/Jb3BRj37mAo'
  }
]