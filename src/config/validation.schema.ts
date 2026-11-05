import { z } from 'zod'

export enum Environment {
	DEVELOPMENT = 'development',
	TEST = 'test',
	PRODUCTION = 'production'
}
export default z.object({
	NODE_ENV: z.enum(Environment).default(Environment.DEVELOPMENT),

	RMQ_URLS: z.string().nonempty(),
	RMQ_QUEUE: z.string().nonempty(),

	SMTP_HOST: z.string().nonempty(),
	SMTP_PORT: z.coerce.number().int().positive(),
	SMTP_USER: z.string().optional().default(''),
	SMTP_PASSWORD: z.string().optional().default(''),
	SMTP_FROM: z.string().nonempty(),
	SMTP_SECURE: z
		.enum(['true', 'false', '1', '0'])
		.default('false')
		.transform(value => value === 'true' || value === '1'),

	SMS_SENDER: z.string().nonempty(),
	SMS_API_KEY: z.string().nonempty(),
	SMS_BASE_URL: z.string().url().nonempty()
})
