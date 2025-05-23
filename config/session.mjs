// import session from 'express-session';
// import MySQLStore from 'express-mysql-session';
import config from './default.mjs'

//--- if need connect session and save in MySQL---
import { createRequire } from 'module'
const require = createRequire(import.meta.url) // Используем require в ES модулях
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
// Создаём хранилище сессий в MySQL
const sessionStore = new MySQLStore({
  host: config.db.mysql.host,
  user: config.db.mysql.user,
  password: config.db.mysql.password,
  database: config.db.mysql.database,
  clearExpired: true, // автоматически удаляет устаревшие сессии
  expiration: 86400000, // 1 день
})

//----------------------------------------------------------------
const sessionConfig = session({
  secret: config.secretKey,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 день
})

export default sessionConfig
