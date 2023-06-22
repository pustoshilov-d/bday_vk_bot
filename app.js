import express from 'express'
import pkg from 'body-parser'

const { urlencoded, json } = pkg
const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())

import goCongratulate from './vk/goCongratulate.js'
import getServerTime from './vk/getServerTime.js'
import { getChats, getCong, getButton, addDayDB } from './db/queries.js'
import getPeople from './vk/getPeople.js'
import sendCong from './vk/sendCong.js'

import { NODE_ENV, TEST_DATE } from './config.js'

console.log('Hello')
console.log(`Mode = ${NODE_ENV}`)

main()

async function main() {
  try {
    const time = await getServerTime()

    console.log('\nСейчас ', time)
    const fullDateStr =
      time.getDate().toString() + '.' + (time.getMonth() + 1).toString() + '.' + time.getFullYear().toString()
    let dateStr = time.getDate().toString() + '.' + (time.getMonth() + 1).toString().toString()
    if (NODE_ENV === 'development' && TEST_DATE !== '') {
      dateStr = TEST_DATE
    }

    const goCode = await goCongratulate(time.getHours() + 3, fullDateStr)
    console.log('goCode: ', goCode)

    if (goCode === 0 || NODE_ENV === 'development') {
      console.log('Сайчас можно поздравлять')

      for (const curChat of await getChats()) {
        console.log('\nРаботаем с: ', curChat.organization)

        const people = await getPeople(dateStr, curChat)

        if (people.size === 0) console.log('Сегодня нет ДР(')
        else {
          console.log('ДР у: ', people.values())

          let sex = people.size === 1 ? people.values().next().value[1] : 'plural'

          let text = ''
          for (const [id_vk, value] of people) {
            text += '@id' + id_vk + '(' + value[0] + '), '
          }
          text = text.slice(0, -2).replace(/,\s([^,]+)$/, ' и $1')

          text += await getCong(sex, curChat.congr_pack)

          let buttonNames = ''
          for (const [id_vk, value] of people) {
            buttonNames += '@' + value[2] + ', '
          }
          buttonNames = buttonNames.slice(0, -2).replace(/,\s([^,]+)$/, ' и $1')
          let buttonText = await getButton(sex, curChat.buttons_pack)
          let button = ''

          if ((buttonText + buttonNames + ' 🎉').length < 40) {
            button = buttonText + buttonNames + ' 🎉'
          } else if (('Поздравляю ' + buttonNames + ' 🎉').length < 40) {
            button = 'Поздравляю ' + buttonNames + ' 🎉'
          } else {
            button = buttonText + ' 🎉'
          }

          console.log('Отправляем поздравление: ', text, '/n', button)
          await sendCong(curChat, text, button)
        }
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
    console.log(e)
  }
}
