import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { AppModule } from './app.module'

async function bootstrap() {
	const logger = new Logger('Bootstrap')
	const app = await NestFactory.create(AppModule)
	const config = app.get(ConfigService)

	const urls = config.getOrThrow<string>('rmq.urls')
	const queue = config.getOrThrow<string>('rmq.queue')

	logger.log(`Connecting to RabbitMQ queue "${queue}"...`)

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.RMQ,
		options: {
			urls: [urls],
			queue,
			queueOptions: { durable: true },
			noAck: false,
			prefetchCount: 1,
			persistent: true
		}
	})

	await app.startAllMicroservices()
	await app.init()

	logger.log(`Notification service is listening on queue "${queue}"`)
}
bootstrap()
