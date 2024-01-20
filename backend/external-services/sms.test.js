const {
  sendSMS,
  sendSMSToMultipleCustomers
} = require('./sms.js')

sendSMS({
  to: '01027881137',
  message: '테스트 메세지입니다. 하나 둘 셋 넷!'
}).then(res => {
  console.log('SMS sent successfully! : ', res)
}).catch(err => {
  console.error('SMS failed! : ', err)
})

sendSMSToMultipleCustomers(
  '테스트 메세지입니다. 하나 둘 셋 넷!',
  ['01027881137', '010adsfasdf']
).then(res => {
  if (res?.failedMessageList?.length) {
    res.failedMessageList.forEach(failedEntry => {
      console.log('@@@ failed entry: ', failedEntry)
    })
  }

  if (res?.groupInfo) {
    const { count } = res.groupInfo

    console.log('@@@ counts: ', count)
  }
}).catch (err => {
  console.error('group SMS failed! : ', err)
})
