import express from 'express'
import pkg from 'body-parser'

const { urlencoded, json } = pkg
const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())

import goCongratulate from './f_vk/goCongratulate.js'
import getServerTime from './f_vk/getServerTime.js'
import { getChats, getCongText, getCongAttachment, getButton, addDayDB } from './f_db/queries.js'
import getPeople from './f_vk/getPeople.js'
import sendCong from './f_vk/sendCong.js'

import { NODE_ENV, TEST_DATE } from './config.js'
import { Attachment } from 'vk-io'

console.log('Hello')
console.log(`Mode = ${NODE_ENV}`)

main()

async function main() {
  try {
    const time = await getServerTime()

    console.log('\nСейчас ', time)
    const fullDateStr =
      time.getDate().toString() + '.' + (time.getMonth() + 1).toString() + '.' + time.getFullYear().toString()
    let dateStr = time.getDate().toString() + '.' + (time.getMonth() + 1).toString()
    if (NODE_ENV === 'development' && TEST_DATE !== '') {
      dateStr = TEST_DATE
    }

    const goCode = await goCongratulate(time.getHours() + 3, fullDateStr)
    console.log('goCode: ', goCode)

    if (goCode === 0 || NODE_ENV === 'development') {
      console.log('Сайчас можно поздравлять')

      for (const curChat of await getChats()) {
        console.log('\nРаботаем с: ', curChat.organization)
        if (curChat.disable_flag) {
          console.log('\n', curChat.organization, 'disabled')
          continue
        }

        const people = await getPeople(dateStr, curChat, time)
        if (people.size === 0) {
          console.log('Сегодня нет ДР(')
          continue
        }

        console.log('ДР у: ', people.values())

        let sex = people.size === 1 ? people.values().next().value[1] : 'plural'

        let text = ''
        for (const [id_vk, value] of people) {
          text += `@id${id_vk}(${value[0]}), `
        }
        text = text.slice(0, -2).replace(/,\s([^,]+)$/, ' и $1')
        text += await getCongText(sex, curChat)

        let attachment = await getCongAttachment(curChat)

        console.log(`Отправили поздравление: text=${text}, attachment=${attachment}`)
        await sendCong(curChat, text, attachment)
      }
      if (NODE_ENV === 'production') {
        await addDayDB(fullDateStr)
      }
    } else if (goCode === 2) {
      console.log('Уже поздравляли')
    } else {
      console.log('Ещё не время для поздравлений')
    }
  } catch (e) {
    throw new Error(`Ошибка в main ${e}`)
  }
}
