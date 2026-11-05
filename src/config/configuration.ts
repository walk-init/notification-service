import validationSchema from './validation.schema'

export default () => {
	const parsed = validationSchema.safeParse(process.env)

	if (!parsed.success) {
		throw new Error(
			`Invalid environment variables: ${parsed.error.message}`
		)
	}
	const env = parsed
	return {
		app: {
			nodeEnv: env.data.NODE_ENV
		},
		rmq: {
			urls: env.data.RMQ_URLS,
			queue: env.data.RMQ_QUEUE
		},
		smtp: {
			host: env.data.SMTP_HOST,
			port: env.data.SMTP_PORT,
			user: env.data.SMTP_USER,
			password: env.data.SMTP_PASSWORD,
			from: env.data.SMTP_FROM,
			secure: env.data.SMTP_SECURE
		},
		sms: {
			sender: env.data.SMS_SENDER,
			apiKey: env.data.SMS_API_KEY,
			baseUrl: env.data.SMS_BASE_URL
		}
	}
}
