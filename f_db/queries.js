import { makeDBRequest } from './dbConnection.js'

export const addDayDB = async (dateStr) => {
  try {
    const sql_string = `INSERT INTO days (day) VALUES ('${dateStr}')`
    await makeDBRequest(sql_string)
    console.log(`\nДата добавлена ${dateStr}`)
  } catch (err) {
    console.log(`Error in addDayDB ${err}`)
  }
}

export const checkDaysDB = async (dateStr) => {
  try {
    const sql_string = `SELECT * FROM days WHERE day = '${dateStr}'`
    let res = await makeDBRequest(sql_string)
    console.log('Результат CheckDaysDB', res.rowCount)
    return res.rowCount === 0
  } catch (err) {
    console.log(`Error in checkDaysDB ${err}`)
  }
}

export const getButton = async (sex, table_name) => {
  try {
    const sql_string = `SELECT ${sex} FROM ${table_name} ORDER BY RANDOM() LIMIT 1`
    let res = await makeDBRequest(sql_string)
    console.log('Результат getButton', res.rowCount)

    return res.rows[0][sex]
  } catch (err) {
    console.log(`Error in getButton ${err}`)
  }
}

export const getChats = async () => {
  try {
    const sql_string = `SELECT * FROM chats`
    let res = await makeDBRequest(sql_string)
    console.log('Результат getChats', res.rowCount)
    return res.rows
  } catch (err) {
    console.log(`Error in getChats ${err}`)
  }
}

export const getCongText = async (sex, chat) => {
  if (chat.congr_type == 'attachment') {
    return chat.default_text
  }
  try {
    const sql_string = `SELECT ${sex} FROM ${chat.congr_pack} ORDER BY RANDOM() LIMIT 1`
    let res = await makeDBRequest(sql_string)
    console.log('Результат getCongText', res.rowCount)

    return res.rows[0][sex]
  } catch (err) {
    console.log(`Error in getCongText ${err}`)
  }
}

export const getCongAttachment = async (chat) => {
  if (chat.congr_type == 'text') {
    return chat.default_attachment
  }
  try {
    const sql_string = `SELECT * FROM ${chat.congr_pack} ORDER BY RANDOM() LIMIT 1`
    let res = await makeDBRequest(sql_string)
    console.log('Результат getCongAttachment', res.rowCount)

    return res.rows[0]['attachment']
  } catch (err) {
    console.log(`Error in getCongAttachment ${err}`)
  }
}

export const getPeopleDB = async (table_name, date) => {
  try {
    const sql_string = `SELECT * FROM ${table_name} WHERE bday = '${date}'`
    let res = await makeDBRequest(sql_string)
    console.log('Результат getPeopleDB', res.rowCount)

    return res.rows
  } catch (err) {
    console.log(`Error in getPeopleDB ${err}`)
  }
}
