import { TIME } from '../config.js'
import { checkDaysDB } from '../db/queries.js'

export default async (hour, dateStr) => {
  try {
    console.log('Текущий час', hour)
    if (hour < TIME) {
      return 1
    } else if (await checkDaysDB(dateStr)) {
      return 0
    } else {
      return 2
    }
  } catch (e) {
    console.log('Ошибка в goCong', e)
  }
}
