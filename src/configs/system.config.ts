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
})
