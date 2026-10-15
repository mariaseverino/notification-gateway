import { Resend } from "resend";
import type { NotificationJob } from "../dto/notification-job.js";
import type { NotificationProvider } from "./notification-provider.js";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailNotificationJob extends NotificationJob {
	content: {
		subject: string;
		body: string;
	};
}

export class EmailProvider implements NotificationProvider {
	async send(input: EmailNotificationJob): Promise<void> {
		const { recipient, content } = input;

		const { error } = await resend.emails.send({
			from: "Acme <onboarding@resend.dev>",
			to: recipient,
			subject: content.subject,
			html: content.body,
		});

		if (error) {
			throw new Error(error.message);
		}
	}
}
