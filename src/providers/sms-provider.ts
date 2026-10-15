import type { NotificationJob } from "../dto/notification-job.js";
import type { NotificationProvider } from "./notification-provider.js";

export class SmsProvider implements NotificationProvider {
	async send(input: NotificationJob): Promise<void> {
		const { recipient, content } = input;

		// Integrar com o provedor de e-mail.
		console.log("Enviando sms", {
			recipients: recipient,
			subject: content.subject,
			body: content.body,
		});
	}
}
