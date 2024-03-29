import {appConfig} from './app.config'
import {cloudinaryConfig} from './cloudinary.config'
import {contractConfig} from './contract.config'
import {databaseConfig} from './database.config'
import {mailConfig} from './mail.config'
import {pusherConfig} from './pusher.config'

export default () => ({
  app: appConfig,
  database: databaseConfig,
  mail: mailConfig,
  pusher: pusherConfig,
  cloudinary: cloudinaryConfig,
  contract: contractConfig,
})
