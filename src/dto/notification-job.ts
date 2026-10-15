export type NotificationChannel = "email" | "sms" | "push" | "whatsapp";

export interface NotificationJob {
	channel: NotificationChannel;
	recipient: string;
	content: {
		subject?: string;
		body: string;
	};
}
