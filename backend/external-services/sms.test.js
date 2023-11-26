const { sendSMS } = require('./sms.js')

sendSMS({
  to: '01027881137',
  message: '테스트 메세지입니다. 하나 둘 셋 넷!'
}).then(res => {
  console.log('SMS sent successfully! : ', res)
}).catch(err => {
  console.error('SMS failed! : ', err)
})

sendSMS({
  to: '01027881137',
  title: '제목 테스트',
  message: '테스트 메세지입니다. 하나 둘 셋 넷!'
}).then(res => {
  console.log('SMS sent successfully! : ', res)
}).catch(err => {
  console.error('SMS failed! : ', err)
})