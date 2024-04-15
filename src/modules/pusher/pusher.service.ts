import {Inject, Injectable} from '@nestjs/common'
import * as Pusher from 'pusher'
import {PUSHER_CONFIG_TOKEN, PusherConfig} from 'src/common/types/pusher'

@Injectable()
export class PusherService {
  private pusher: Pusher

  constructor(@Inject(PUSHER_CONFIG_TOKEN) config: PusherConfig) {
    console.log(config)
    this.pusher = new Pusher({
      appId: config.app_id,
      key: config.key,
      secret: config.secret,
      cluster: config.cluster,
      useTLS: true,
    })

    console.log(this.pusher)
  }

  trigger(channel: string, event: string, data: any) {
    console.log('PusherService: trigger', channel, event, data)
    this.pusher.trigger(channel, event, JSON.stringify(data))
  }
}
