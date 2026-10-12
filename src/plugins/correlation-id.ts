import { randomUUID } from "node:crypto";
import { trace } from "@opentelemetry/api";
import type { FastifyInstance } from "fastify";

export async function correlationIdPlugin(fastify: FastifyInstance) {
	fastify.addHook("onRequest", async (request, reply) => {
		const incoming = request.headers["x-correlation-id"];

		const correlationId =
			typeof incoming === "string" && incoming.trim()
				? incoming.trim()
				: randomUUID();

		request.correlationId = correlationId;

		reply.header("x-correlation-id", correlationId);

		request.log = request.log.child({ correlationId });
	});

	fastify.addHook("preHandler", async (request) => {
		const span = trace.getActiveSpan();

		if (span && request.correlationId) {
			span.setAttribute("correlation.id", request.correlationId);
		}
	});
}
