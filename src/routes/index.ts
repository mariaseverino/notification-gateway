import jwt from "jsonwebtoken";
import WebPush from "web-push";
import z from "zod/v4";
import { db } from "../database/client.js";
import { apiKeys } from "../database/schema.js";
import { sendNotificationSchema } from "../dto/send-notification-input.js";
import { sendNotificationController } from "../notification/send-notification-to-queue.controller.js";
import type { FastifyTypeInstance } from "../types/fastify-type.js";
import { authenticate } from "./authenticate.js";

export async function routes(fastify: FastifyTypeInstance) {
	fastify.get(
		"/health",
		{
			schema: {
				response: {
					200: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (_request, reply) => {
			console.log(WebPush.generateVAPIDKeys());
			return reply.status(200).send({ message: "server running!" });
		},
	);
	fastify.post(
		"/generate-key",
		{
			config: {
				rateLimit: {
					max: 1,
					timeWindow: "1 year",
				},
			},
			schema: {
				response: {
					201: z.object({
						api_key: z.string(),
					}),
				},
			},
		},
		async (_request, reply) => {
			const JWT_SECRET = process.env.JWT_SECRET;

			if (!JWT_SECRET) {
				throw new Error("JWT_SECRET should be defined");
			}

			const token = jwt.sign({}, JWT_SECRET, {
				expiresIn: "356d",
			});

			await db.insert(apiKeys).values({ token });

			return reply.status(201).send({ api_key: token });
		},
	);

	fastify.post(
		"/notification/send",
		{
			config: {
				rateLimit: {
					max: 100,
					timeWindow: "1 minute",
				},
			},
			schema: {
				body: sendNotificationSchema,
				response: {
					202: z.object({
						data: z.string(),
					}),
				},
			},
			preHandler: authenticate,
		},
		sendNotificationController.handle,
	);
}
