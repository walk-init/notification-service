import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

export const getMailerConfig = (
	configService: ConfigService
): MailerOptions => {
	const user = configService.get<string>('smtp.user')
	const pass = configService.get<string>('smtp.password')

	return {
		transport: {
			host: configService.getOrThrow<string>('smtp.host'),
			port: configService.getOrThrow<number>('smtp.port'),
			secure: configService.getOrThrow<boolean>('smtp.secure'),
			...(user && pass ? { auth: { user, pass } } : {})
		},
		defaults: {
			from: configService.getOrThrow<string>('smtp.from')
		}
	}
}
