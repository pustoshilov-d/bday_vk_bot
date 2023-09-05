import { API } from 'vk-io'

import { getPeopleDB } from '../f_db/queries.js'
import { EXTERNAL_DB_FLAG } from '../config.js'

function monthDiff(dateFrom, dateTo) {
  return dateTo.getMonth() - dateFrom.getMonth() + 12 * (dateTo.getFullYear() - dateFrom.getFullYear())
}

export default async (today_day, chat, today_date) => {
  const api = new API({
    token: chat.group_token,
  })
  let res = await api.messages.getConversationMembers({
    v: 5.103,
    peer_id: chat.chat_id_in_group,
    fields: 'bdate, sex, screen_name, last_seen',
    group_id: chat.group_id,
  })

  // console.log({ res });

  let users = res.profiles || []
  console.log(`Найдено в ${chat.chat_id_in_group} ${users.length} людей`)
  let people = new Map()

  for (const user of users) {
    // in ban
    if (user.hasOwnProperty('deactivated')) {
      console.debug(`${user.id} deactivated`)
      continue
    }
    // dead, half of year
    if (!user.hasOwnProperty('last_seen')) {
      console.debug(`${user.id} умер, нет last_seen поля`)
      continue
    }
    let last_seen_date = new Date(user.last_seen.time * 1000)
    let month_diff = monthDiff(last_seen_date, today_date)
    if (month_diff > 6) {
      console.debug(`${user.id} умер, не был ${month_diff} месяцев`)
      continue
    }
    // without bday
    if (!user.hasOwnProperty('bdate') || user.bdate == undefined) {
      // console.debug(`${user.id} не имеет bdate`)
      continue
    }

    let bday = user.bdate.split('.')[0] + '.' + user.bdate.split('.')[1]
    if (today_day === bday) {
      let sex = user.sex === 2 ? 'male' : 'female'
      people.set(user.id, [user.first_name, sex, user.screen_name])
    }
  }
  console.log(`Найдено в ${chat.chat_id_in_group} ${people.size} людей c ДР`)

  if (EXTERNAL_DB_FLAG === 'true' && chat.external_db !== null) {
    for (const user of await getPeopleDB(chat.external_db, today_day)) {
      people.set(user.id_vk, [user.name, user.sex])
    }
  }

  // console.log(people.values())

  return people
}
