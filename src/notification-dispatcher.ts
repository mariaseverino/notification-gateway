import type {
	NotificationChannel,
	NotificationJob,
} from "./dto/notification-job.js";
import { EmailProvider } from "./providers/email-provider.js";
import type { NotificationProvider } from "./providers/notification-provider.js";
import { PushProvider } from "./providers/push-provider.js";
import { SmsProvider } from "./providers/sms-provider.js";
import { WhatsappProvider } from "./providers/whatsapp-provider.js";

const providers: Record<NotificationChannel, NotificationProvider> = {
	email: new EmailProvider(),
	sms: new SmsProvider(),
	push: new PushProvider(),
	whatsapp: new WhatsappProvider(),
};

class NotificationDispatcher {
	async dispatch(job: NotificationJob) {
		await providers[job.channel].send(job);
	}
}

export const notificationDispatcher = new NotificationDispatcher();
