import amqp from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL;

if (!RABBITMQ_URL) {
	throw new Error("RABBITMQ_URL should be defined");
}

const connection = await amqp.connect(RABBITMQ_URL);

const channel = await connection.createConfirmChannel();

const queue = "hello";

await channel.assertQueue(queue, {
	durable: true,
	arguments: {
		"x-queue-type": "quorum",
	},
});

export { channel, connection, queue };
