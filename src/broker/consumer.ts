import type { NotificationJob } from "../dto/notification-job.js";
import { notificationDispatcher } from "../notification-dispatcher.js";
import { channel, queue } from "./index.js";

async function startConsumer() {
	await channel.prefetch(10);

	await channel.consume(
		queue,
		async (msg) => {
			if (!msg) return;

			try {
				const job = JSON.parse(
					msg.content.toString(),
				) as NotificationJob;

				await notificationDispatcher.dispatch(job);

				channel.ack(msg);
			} catch (error) {
				console.error("Erro ao processar notificação:", error);

				channel.nack(msg, false, true);
			}
		},
		{ noAck: false },
	);
}

startConsumer();
