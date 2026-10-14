import type { FastifyReply, FastifyRequest } from "fastify";
import type { SendNotificationInput } from "../dto/send-notification-input.js";
import { sendNotificationToQueueUseCase } from "./send-notification-to-queue.use-case.js";

class SendNotificationController {
	async handle(
		request: FastifyRequest<{ Body: SendNotificationInput }>,
		reply: FastifyReply,
	) {
		const result = await sendNotificationToQueueUseCase.execute(
			request.body,
		);

		return reply.code(202).send({
			data: result.message,
		});
	}
}

export const sendNotificationController = new SendNotificationController();
