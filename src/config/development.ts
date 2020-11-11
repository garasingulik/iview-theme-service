import { Config } from './index'

const config: Config = {
  port: 5005,
  secret: process.env.API_SECRET || ''
}

export default config
