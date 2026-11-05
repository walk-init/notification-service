import { HttpModule } from '@nestjs/axios'
import { type DynamicModule, Module } from '@nestjs/common'

import { SMS_OPTIONS } from './constatnts'
import { smsAsyncOptionsInterfaces, smsOptionsInterfaces } from './interfaces'
import { SmsService } from './sms.service'

@Module({})
export class SmsModule {
	public static register(
		options: smsOptionsInterfaces.SmsOptions
	): DynamicModule {
		return {
			module: SmsModule,
			imports: [HttpModule],
			providers: [
				{
					provide: SMS_OPTIONS,
					useValue: options
				},
				SmsService
			],
			exports: [SmsService]
		}
	}

	public static registerAsync(
		options: smsAsyncOptionsInterfaces.SmsAsyncOptions
	): DynamicModule {
		return {
			module: SmsModule,
			imports: [HttpModule, ...(options.imports ?? [])],
			providers: [
				{
					provide: SMS_OPTIONS,
					useFactory: options.useFactory,
					inject: options.inject ?? []
				},
				SmsService
			],
			exports: [SmsService]
		}
	}
}
