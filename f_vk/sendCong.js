import { API } from 'vk-io'
import { TEST_TOKEN, TEST_GROUP, TEST_CHAT, TEST_PHOTO, NODE_ENV } from '../config.js'

export default async (chat, text, attachment) => {
  const api = new API({
    token: chat.group_token,
  })

  let group_id, peer_id, message, keyboard, access_token

  if (NODE_ENV === 'development') {
    access_token = TEST_TOKEN
    group_id = TEST_GROUP
    peer_id = TEST_CHAT
    message = text
    keyboard = JSON.stringify({
      one_time: false,
      inline: true,
      buttons: [
        [
          {
            action: {
              type: 'text',
              label: "test",
              payload: { command: 'congr' },
            },
            color: 'positive',
          },
        ],
      ],
    })
  } else {
    access_token = chat.group_token
    group_id = chat.group_id
    peer_id = chat.chat_id_in_group
    message = text
  }

  try {
    const res = await api.messages.send({
      v: 5.103,
      access_token: access_token,
      group_id: chat.group_id,
      peer_id: peer_id,
      random_id: Math.floor(Math.random() * 999999999),
      message: message,
      attachment: attachment,
      // keyboard: keyboard,
    })
    console.log('Результат sendCong', res)
    return res
  } catch (err) {
    console.log(`Ошибка в sendCong в organization=${chat.organization} peer_id=${peer_id} ${err}`)
    return
  }
}
