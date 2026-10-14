import type { NotificationJob } from "../dto/notification-job.js";

export interface NotificationProvider {
	send(input: NotificationJob): Promise<void>;
}
