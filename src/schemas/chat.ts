import { MessageRole } from "@/lib/prisma/generated/enums";
import { z } from "zod";

export const sendMessageSchema = z.object({
  messages: z
    .array(
      z.object({
        content: z.string().trim().min(2).max(500),
        role: z.enum([MessageRole.user, MessageRole.assistant]),
      }),
    )
    .min(1)
    .max(50),
  webSearch: z.boolean(),
});

export const getChatSchema = z.object({
  id: z.string().trim(),
});

