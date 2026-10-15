import { channel, queue } from "./index.js";

export async function sendToQueue(data: Buffer) {
	channel.sendToQueue(queue, data, {
		persistent: true,
		contentType: "application/json",
	});

	await channel.waitForConfirms();
}
