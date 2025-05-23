import dotenv from 'dotenv'
dotenv.config()

export default Object.freeze({
  db: {
    mysql: {
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DATABASE,
    },
  },
  email: {
    user: process.env.MAIL_USER,
    password: process.env.EMAIL_PASSWORD,
  },
  port: process.env.PORT,
  secretKey: process.env.SECRET_KEY,
  tokenKey: process.env.TOKEN_KEY,
})
