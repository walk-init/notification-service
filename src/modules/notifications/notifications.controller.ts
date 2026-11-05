import { Controller, Logger } from '@nestjs/common'
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'
import type {
	EmailChangedEvent,
	OtpRequestedEvent,
	PhoneChangedEvent
} from '@walkcat/contracts'
import { RmqService } from 'src/infrastructure/rmq/rmq.service'

import { NotificationsService } from './notifications.service'

@Controller()
export class NotificationsController {
	private readonly logger = new Logger(NotificationsController.name)
	public constructor(
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
			this.logger.debug(' OTP requested: ', data)
			this.rmqService.ack(context)
		} catch (error) {
			this.logger.error('Error processing OTP requested  : ', error)
			this.rmqService.nack(context)
		}
	}
	@EventPattern('account.phone.changed')
	public async phoneChanged(
		@Payload() data: PhoneChangedEvent,
		@Ctx() context: RmqContext
	) {
		try {
			await this.notificationsService.sendPhoneChange(data)
			this.logger.debug(' Phone changed: ', data)
			this.rmqService.ack(context)
		} catch (error) {
			this.logger.error('Error processing phone changed: ', error)
			this.rmqService.nack(context)
		}
	}
	@EventPattern('account.email.changed')
	public async emailChanged(
		@Payload() data: EmailChangedEvent,
		@Ctx() context: RmqContext
	) {
		try {
			await this.notificationsService.sendEmailChange(data)
			this.logger.debug(' Email changed: ', data)
			this.rmqService.ack(context)
		} catch (error) {
			this.logger.error('Error processing email changed: ', error)
			this.rmqService.nack(context)
		}
	}
}
