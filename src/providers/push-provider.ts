import type { NotificationJob } from "../dto/notification-job.js";
import type { NotificationProvider } from "./notification-provider.js";

export class PushProvider implements NotificationProvider {
	async send(input: NotificationJob): Promise<void> {
		const { recipient, content } = input;

		// Integrar com o provedor de e-mail.
		console.log("Enviando push", {
			recipients: recipient,
			subject: content.subject,
			body: content.body,
		});
	}
}
