import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RmqService } from 'src/infrastructure/rmq/rmq.service'

import { getSmsConfig } from '../../config/factories'
import { MailModule } from '../../infrastructure/mail/mail.module'
import { SmsModule } from '../../infrastructure/sms/sms.module'

import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service'

@Module({
	imports: [
		MailModule,
		SmsModule.registerAsync({
			inject: [ConfigService],
			useFactory: getSmsConfig
		})
	],
	controllers: [NotificationsController],
	providers: [NotificationsService, RmqService]
})
export class NotificationsModule {}
