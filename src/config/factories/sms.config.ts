import { ConfigService } from '@nestjs/config'
import type { SmsOptions } from 'src/infrastructure/sms/interfaces/sms-options.interface'

export const getSmsConfig = (configService: ConfigService): SmsOptions => {
	return {
		baseUrl: configService.getOrThrow<string>('sms.baseUrl'),
		apiKey: configService.getOrThrow<string>('sms.apiKey'),
		sender: configService.getOrThrow<string>('sms.sender')
	}
}
