import { API } from 'vk-io'

import { getPeopleDB } from '../f_db/queries.js'
import { EXTERNAL_DB_FLAG } from '../config.js'

export default async (date, chat) => {
  const api = new API({
    token: chat.group_token,
  })
  let res = await api.messages.getConversationMembers({
    v: 5.103,
    peer_id: chat.chat_id_in_group,
    fields: 'bdate, sex, screen_name',
    group_id: chat.group_id,
  })

  // console.log({ res });

  let users = res.profiles
  console.log(`Найдено в ${chat.chat_id_in_group} ${users.length} людей`)

  let people = new Map()

  for (const user of users) {
    if (user.bdate !== undefined) {
      let bday = user.bdate.split('.')[0] + '.' + user.bdate.split('.')[1]
      if (date === bday) {
        let sex = user.sex === 2 ? 'male' : 'female'
        people.set(user.id, [user.first_name, sex, user.screen_name])
      }
    }
  }
  console.log(`Найдено в ${chat.chat_id_in_group} ${people.size} людей c ДР`)

  if (EXTERNAL_DB_FLAG === 'true' && chat.external_db !== null) {
    for (const user of await getPeopleDB(chat.external_db, date)) {
      people.set(user.id_vk, [user.name, user.sex])
    }
  }

  // console.log(people.values())

  return people
}
