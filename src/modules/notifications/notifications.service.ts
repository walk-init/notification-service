import { Injectable } from '@nestjs/common'
import {
	EmailChangedEvent,
	OtpRequestedEvent,
	PhoneChangedEvent
} from '@walkcat/contracts'

import { MailService } from '../../infrastructure/mail/mail.service'
import { SmsService } from '../../infrastructure/sms/sms.service'

@Injectable()
export class NotificationsService {
	public constructor(
		private readonly mailService: MailService,
		private readonly smsService: SmsService
	) {}

	public async sendOtpCode(data: OtpRequestedEvent): Promise<void> {
		const { identifier, code, type } = data
		if (type === 'email') {
			await this.mailService.sendOtpCode(identifier, code)
		}
		if (type === 'phone') {
			await this.smsService.sendOtpCode(identifier, code)
		}
	}
	public async sendPhoneChange(data: PhoneChangedEvent): Promise<void> {
		const { phone, code } = data
		await this.smsService.sendPhoneChange(phone, code)
	}
	public async sendEmailChange(data: EmailChangedEvent): Promise<void> {
		const { email, code } = data
		await this.mailService.sendEmailChange(email, code)
	}
}
