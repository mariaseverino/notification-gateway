import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

export async function routes(fastify: FastifyInstance) {
  fastify.get(
    '/health',
    {
      schema: {
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send({ message: 'server running!' });
    }
  );
}