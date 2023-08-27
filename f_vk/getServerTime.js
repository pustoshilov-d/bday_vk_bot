import { API } from 'vk-io'
import { TEST_TOKEN } from '../config.js'

export default async () => {
  const api = new API({
    token: TEST_TOKEN,
  })

  let res = await api.utils.getServerTime({
    v: 5.103,
  })
  return new Date(res * 1000)
}
