import z from "zod/v4";

export const sendNotificationSchema = z.object({
	channel: z
		.array(z.enum(["email", "sms", "push", "whatsapp"]))
		.min(1, "Informe pelo menos um canal"),

	recipient: z.object({
		address: z
			.array(z.string().min(1))
			.min(1, "Informe pelo menos um destinatário"),
	}),

	content: z.object({
		subject: z.string().min(1).optional(),
		title: z.string().min(1).optional(),
		body: z.string().min(1, "O conteúdo é obrigatório"),
	}),

	metadata: z.record(z.string(), z.unknown()).optional(),
});

export type SendNotificationInput = z.infer<typeof sendNotificationSchema>;
