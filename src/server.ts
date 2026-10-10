import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastify from 'fastify';
import {
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import {z} from 'zod/v4';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: '*' });

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Notification Gateway',
            version: '1.0.0',
        },
    },
    transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, { routePrefix: '/docs' });

app.get(
  '/health',
  {
    schema: {
      response: {
        200: z.object({
          message: z.string()
        })
      }
    }
  },
  async (request, reply) => {
    return reply.status(200).send({ message: "server running!" });
  }
)

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
    console.log('server running');
});