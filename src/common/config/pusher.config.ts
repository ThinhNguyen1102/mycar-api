import * as process from 'process'
import * as dotenv from 'dotenv'

dotenv.config()

const pusherConfig = {
  pusher_app_id: process.env.PUSHER_APP_ID,
  pusher_key: process.env.PUSHER_KEY,
  pusher_secret: process.env.PUSHER_SECRET,
  pusher_cluster: process.env.PUSHER_CLUSTER,
}

export {pusherConfig}
