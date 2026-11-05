import { Injectable } from '@nestjs/common'
import * as Handlebars from 'handlebars'
import * as path from 'path'

import * as fs from 'fs/promises'

@Injectable()
export class MailTemplateService {
	private cache = new Map<string, Handlebars.TemplateDelegate>()

	public async renderTemplate(
		templateName: string,
		context?: Record<string, any>
	) {
		if (!this.cache.has(templateName)) {
			const templatePath = path.join(
				process.cwd(),
				'src',
				'infrastructure',
				'mail',
				'templates',
				`${templateName}.hbs`
			)
			const template = await fs.readFile(templatePath, 'utf8')
			this.cache.set(templateName, Handlebars.compile(template))
		}
		const compiledTemplate = this.cache.get(templateName)

		return compiledTemplate!(context)
	}
}
