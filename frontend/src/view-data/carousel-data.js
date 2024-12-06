import { genId, humanDate } from '@utils'

const displayDate = str => humanDate(str, { month: 'short', day: 'numeric', year: 'numeric' })

export const testimonials = [
  {
    id: genId(),
    type: 'youtube-feedback',
    name: '아이디 stor* 님',
    date: '2024년 12월',
    content: '이분 유튜브에서 하시는 말씀은 올바른 방향을 얘기해주셔서 좋은 듯.'
  },
  {
    id: genId(),
    type: 'visit-review',
    name: '백남* 님',
    date: '2024년 12월',
    content: '선생님이 제 머릿속에 도청장치를 해놓은 것처럼 정확하네요.'
  },
  {
    id: genId(),
    type: 'youtube-feedback',
    name: '성함 비공개',
    date: '2024년 11월',
    content: '경신생입니다. 신굿을 세번이나 하였고, 지난 이십년 세월 전국팔도 점집을 찾아다니다 무속세계 발길을 끊었었지만, 올바르신 선생님 같으셔서 나중에 신령님께 절 드리러 찾아뵙고자 연락 드려요.<br/>' +
      '이 시대 최고의 찐무당 곱디고우신 선생님 다음에 상황봐서 꼭 인사 드릴게요. 어려운 시국 선생님 만큼은 꼭 일등하세요!'
  },
  {
    id: genId(),
    type: 'visit-review',
    name: "이희* 님",
    date: '2024년 8월',
    content: '주변에 엄청 홍보중입니다.<br/>지인들이 선녀님 뵙고 오면, 다들 다른 곳과 다르게 희망을 준다고 그러네요!'
  },
  {
    id: genId(),
    type: 'youtube-feedback',
    name: "김나인 님(유튜브 출연)",
    date: '2024년 8월',
    content: '저는 이번에 선녀님 만나고 소름 돋으며 제 인생이 확 바꼈습니다. 신기한 삶을 살고 있어요^^.<br/>월별로 얘기해주신거 진짜 소름돋아요~ 현재 7~8월 얘기하신 다른곳에서의 합작, 영역확대 진행중이예요. ' +
      '이게 말이 되나용? 얘기하신 내년꺼.. 기대하고 있습니당'
  },
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
    name: '성함 비공개',
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
    title: "2025년에 대통령이 탄핵될까?",
    videoId: 'pBpv2dJ2Lsk',
    id: 'pBpv2dJ2Lsk',
    date: '2024.11.25'
  },
  {
    title: "선녀님의 영화 '파묘' 감상평",
    videoId: 'C52vu9F-cuk',
    id: 'C52vu9F-cuk',
    date: '2024.03.15'
  },
  {
    title: "민희진 사주 분석",
    videoId: 'vdEfaLyxPEY',
    id: 'vdEfaLyxPEY',
    date: '2024.05.20'
  }
]
