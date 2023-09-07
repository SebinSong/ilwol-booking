import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  selectCounselDate,
  selectCounselOption,
  selectCounselTimeSlot
} from '@store/features/counselDetailsSlice.js'

export default function useCounselOptionSteps () {
  const navigate = useNavigate()

  // data from store
  const counselOptionInstore = useSelector(selectCounselOption)
  const counselDateInStore = useSelector(selectCounselDate)
  const counselTimeSlotInStore = useSelector(selectCounselTimeSlot)

  const stateCheckFunc = {
    'counsel-option': () => Boolean(counselOptionInstore),
    'date-and-time': () => (Boolean(counselDateInStore) && Boolean(counselTimeSlotInStore))
  }
  const checkStepStateAndGo = (stepId) => {
    if (!stateCheckFunc[stepId]()) {
      navigate(`/booking/${stepId}`)
    }
  }

  return {
    counselOptionInstore,
    counselDateInStore,
    counselTimeSlotInStore,
    checkStepStateAndGo
  }
}
