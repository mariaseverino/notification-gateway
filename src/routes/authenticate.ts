import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

export async function authenticate(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const JWT_SECRET = process.env.JWT_SECRET;

	if (!JWT_SECRET) {
		throw new Error("JWT_SECRET should be defined");
	}

	const authHeader = request.headers.authorization;
	const token = authHeader?.startsWith("Bearer ")
		? authHeader.slice(7)
		: undefined;

	if (!token) {
		return reply.status(401).send({
			message: "API key missing",
		});
	}

	try {
		jwt.verify(token, JWT_SECRET);
	} catch {
		return reply.status(401).send({
			message: "Invalid or expired API key",
		});
	}
}
