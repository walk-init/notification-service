import { Controller } from '@nestjs/common'
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'
import type { OtpRequestedEvent } from '@walkcat/contracts'
import { RmqService } from 'src/infrastructure/rmq/rmq.service'

import { NotificationsService } from './notifications.service'

@Controller()
export class NotificationsController {
	constructor(
		private readonly notificationsService: NotificationsService,
		private readonly rmqService: RmqService
	) {}

	@EventPattern('auth.otp.requested')
	public async otpRequested(
		@Payload() data: OtpRequestedEvent,
		@Ctx() context: RmqContext
	) {
		try {
			await this.notificationsService.sendOtpCode(data)
			console.log(' OTP requested: ', data)
			this.rmqService.ack(context)
		} catch (error) {
			console.error('Error processing OTP requested  : ', error)
			this.rmqService.nack(context)
		}
	}
}
