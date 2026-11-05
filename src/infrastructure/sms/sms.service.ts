import { HttpService } from '@nestjs/axios'
import { Inject, Injectable } from '@nestjs/common'
import { Logger } from '@nestjs/common'
import {
	catchError,
	delay,
	firstValueFrom,
	retryWhen,
	scan,
	throwError,
	timeout
} from 'rxjs'

import { SMS_OPTIONS } from './constatnts'
import type { sendSmsInterfaces } from './interfaces'
import type { SmsOptions } from './interfaces/sms-options.interface'

@Injectable()
export class SmsService {
	private readonly logger = new Logger(SmsService.name)
	private readonly baseUrl: string
	public constructor(
		private readonly httpService: HttpService,
		@Inject(SMS_OPTIONS) private readonly options: SmsOptions
	) {
		this.baseUrl = options.baseUrl
	}
	public async sendOtpCode(
		phone: string,
		code: string
	): Promise<sendSmsInterfaces.SendSmsResponse> {
		return this.send({
			destination: phone,
			text: `Ваш код для входа в систему: ${code}`
		})
	}

	public async send(
		data: sendSmsInterfaces.SendSmsRequest
	): Promise<sendSmsInterfaces.SendSmsResponse> {
		const payload = {
			number: data.sender ?? this.options.sender,
			destination: data.destination.replace('+', ''),
			text: data.text
		}

		return this.request<sendSmsInterfaces.SendSmsResponse>(
			'POST',
			'/messaging/v1/SendSMS',
			payload
		)
	}

	private async request<T>(
		method: 'POST' | 'GET',
		path: string,
		body?: Record<string, unknown>
	): Promise<T> {
		const url = `${this.baseUrl}${path}`
		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${this.options.apiKey}`
		}
		try {
			const request = this.httpService
				.request<T>({
					url,
					method,
					headers,
					data: body
				})
				.pipe(
					timeout(7000),
					retryWhen(errors =>
						errors.pipe(
							scan((retryCount, error) => {
								if (retryCount >= 2) {
									this.logger.warn(
										`RETRY API CALL (${method} ${path}) - ${retryCount + 1}/3 times)}`
									)
									throw error
								}
								return retryCount + 1
							}, 0),
							delay(500)
						)
					),
					catchError(error => {
						const details =
							error.response?.data ?? error.message ?? error

						this.logger.error(
							`API ERROR (${method} ${path}): \n ${JSON.stringify(details)}`
						)

						return throwError(() => error)
					})
				)
			const response = await firstValueFrom(request)
			return response.data
		} catch (error) {
			this.logger.error(`Request failed: ${error}`)
			throw error
		}
	}
}
