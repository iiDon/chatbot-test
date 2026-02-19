import { CustomizedError } from "@/lib/errors/error";
import { throwError } from "@/lib/errors/throwError";
import { prisma } from "@/lib/prisma/prisma";
import { AuthGuard } from "@/server/actions/services/guard";
import {
  streamText,
  generateText,
  UIMessage,
  convertToModelMessages,
  stepCountIs,
} from "ai";
import { openai } from "@/server/actions/services/openai";
import { webSearch } from "@exalabs/ai-sdk";
import { MessageRole } from "@/lib/prisma/generated/enums";
import { AIResponseResualtType } from "@/types/types";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    const { user } = await AuthGuard();
    const { chatId } = await params;

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userId: user.id,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chat) {
      throw new CustomizedError("Chat not found", 404);
    }

    return Response.json({ success: true, data: chat });
  } catch (error) {
    return throwError(error);
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    const { user } = await AuthGuard();
    const { chatId } = await params;

    const chat = await prisma.chat.findUnique({
      where: { id: chatId, userId: user.id },
    });

    if (!chat) {
      throw new CustomizedError("Chat not found", 404);
    }

    const {
      messages,
      webSearch: enableWebSearch,
    }: { messages: UIMessage[]; webSearch: boolean } = await req.json();

    const lastMsg = messages[messages.length - 1];
    const userText = lastMsg?.parts.find((p) => p.type === "text")?.text;

    if (userText) {
      await prisma.message.create({
        data: { role: MessageRole.user, content: userText, chatId },
      });
    }

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: enableWebSearch
        ? "You are a helpful assistant. You have access to a webSearch tool. Always use it to search the web before answering."
        : "You are a helpful assistant.",
      messages: await convertToModelMessages(messages),
      ...(enableWebSearch && {
        tools: {
          webSearch: webSearch({
            numResults: 6,
            contents: {
              text: { maxCharacters: 1000 },
              extras: {
                imageLinks: 3,
              },
            },
          }),
        },
        stopWhen: stepCountIs(3),
      }),
      onFinish: async ({ text: aiText, steps }) => {
        if (aiText) {
          const sources = steps
            .flatMap((step) => step.toolResults)
            .filter((tr) => tr.toolName === "webSearch")
            .flatMap((tr) => {
              const results = (
                tr.output as { results?: AIResponseResualtType[] }
              )?.results;

              if (!Array.isArray(results)) return [];
              console.log("resulat", results[0]?.title);

              return results.map((r) => ({ url: r.url, title: r.title }));
            });

          await prisma.message.create({
            data: {
              role: MessageRole.assistant,
              content: aiText,
              chatId,
              ...(sources.length > 0 && { sources }),
            },
          });
        }

        if (!chat.title && userText) {
          const { text: title } = await generateText({
            model: openai("gpt-4o-mini"),
            prompt: `Generate a short chat title (max 6 words, no quotes) for this message: "${userText}"`,
          });

          await prisma.chat.update({
            where: { id: chatId },
            data: { title: title.trim() },
          });
        }
      },
    });

    result.consumeStream();

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
    });
  } catch (error) {
    return throwError(error);
  }
}
