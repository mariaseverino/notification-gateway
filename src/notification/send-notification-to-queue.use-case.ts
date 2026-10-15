import z from "zod/v4";
import { sendToQueue } from "../broker/sender.js";
import type { SendNotificationInput } from "../dto/send-notification-input.js";

export type NotificationChannel = "email" | "sms" | "push" | "whatsapp";

const providers = {
	email: z.email(),
	sms: z.e164(),
	push: z.string().min(1),
	whatsapp: z.e164(),
} satisfies Record<NotificationChannel, z.ZodType>;

class SendNotificationToQueueUseCase {
	async execute(input: SendNotificationInput) {
		const { channel, recipient, content } = input;

		if (channel.length !== recipient.address.length) {
			throw new Error(
				"A quantidade de canais deve ser igual à quantidade de contatos",
			);
		}

		const jobs = channel.map((currentChannel, index) => {
			const address = recipient.address[index];
			const result = providers[currentChannel].safeParse(address);

			if (!result.success) {
				throw new Error(
					`Destinatário inválido para o canal ${currentChannel}`,
				);
			}

			return {
				channel: currentChannel,
				recipient: address,
				content,
			};
		});

		for (const job of jobs) {
			await sendToQueue(Buffer.from(JSON.stringify(job)));
		}

		return {
			message: "Notificações publicadas na fila",
			count: jobs.length,
		};
	}
}

export const sendNotificationToQueueUseCase =
	new SendNotificationToQueueUseCase();
