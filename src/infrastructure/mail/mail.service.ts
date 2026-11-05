import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

import { MailTemplateService } from './template.service'

@Injectable()
export class MailService {
	public constructor(
		private readonly mailerService: MailerService,
		private readonly mailTemplateService: MailTemplateService
	) {}

	public async sendOtpCode(email: string, code: string): Promise<void> {
		const html = await this.mailTemplateService.renderTemplate('otp', {
			code
		})
		await this.mailerService.sendMail({
			to: email,
			subject: 'КОД ПОТТВЕРЖДЕНИЯ',
			html
		})
	}
	public async sendEmailChange(email: string, code: string): Promise<void> {
		const html = await this.mailTemplateService.renderTemplate(
			'email-changed',
			{
				code
			}
		)
		await this.mailerService.sendMail({
			to: email,
			subject: 'ИЗМЕНЕНИЕ ЭЛЕКТРОННОЙ ПОЧТЫ',
			html
		})
	}
}
