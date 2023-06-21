require('dotenv').config()
export interface Config {
  [key: string]: any
}

export default (): Config => ({
  DATABASE_URL: process.env.DATABASE_URL,
  APP_PORT: process.env.APP_PORT,
  JWT: {
    JWT_SECRECT_KEY: process.env.JWT_ACCESS_SECRET || 'JWT_ACCESS_SECRET',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  },
  swagger: {
    path: process.env.SWAGGER_PATH || 'swagger',
  },
  mailer: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT || 587,
    auth: {
      username: process.env.MAIL_USERNAME || 'username',
      password: process.env.MAIL_PASSWORD || 'password',
    },
  },
})
