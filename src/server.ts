import "./tracing.js";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { trace } from "@opentelemetry/api";
import { fastify } from "fastify";
import fp from "fastify-plugin";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { correlationIdPlugin } from "./plugins/correlation-id.js";
import { routes } from "./routes/index.js";

const app = fastify({
	logger: {
		level: "info",

		mixin() {
			const span = trace.getActiveSpan();
			const context = span?.spanContext();

			if (!context) {
				return {};
			}

			return {
				trace_id: context.traceId,
				span_id: context.spanId,
			};
		},
	},
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: "*" });

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Notification Gateway",
			version: "1.0.0",
		},
	},
	transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, { routePrefix: "/docs" });

app.register(fp(correlationIdPlugin));
app.register(routes);

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
	console.log("server running");
});
