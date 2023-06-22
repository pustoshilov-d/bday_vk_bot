import 'dotenv/config'

export const NODE_ENV = process.env.NODE_ENV || 'development'

export const TIME = process.env.TIME
export const EXTERNAL_DB_FLAG = process.env.EXTERNAL_DB_FLAG
export const DATABASE_URL = process.env.DATABASE_URL

export const TEST_TOKEN = process.env.TEST_TOKEN
export const TEST_GROUP = process.env.TEST_GROUP
export const TEST_CHAT = process.env.TEST_CHAT
export const TEST_PHOTO = process.env.TEST_PHOTO
export const TEST_DATE = process.env.TEST_DATE
