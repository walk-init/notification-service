import { Injectable } from '@nestjs/common'
import { OtpRequestedEvent } from '@walkcat/contracts'

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
}
