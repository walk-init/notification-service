export interface SendSmsRequest {
	sender?: string
	destination: string
	text: string
}

export interface SendSmsResponse {
	messageId: string
	templateResourceId: string
}
