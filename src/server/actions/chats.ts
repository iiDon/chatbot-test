"use server";

import { returnError } from "@/lib/errors/returnError";
import { AuthGuard } from "./services/guard";
import { prisma } from "@/lib/prisma/prisma";
import { sendMessageSchema } from "@/schemas/chat";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";
import { CustomizedError } from "@/lib/errors/error";

export const createChat = async (dto: z.infer<typeof sendMessageSchema>) => {
  let chatId: string | null = null;

  try {
    const { user } = await AuthGuard();

    const newChat = await prisma.chat.create({
      data: { userId: user.id },
    });

    chatId = newChat.id;
    revalidatePath("/");
  } catch (error) {
    return returnError(error);
  }

  redirect(`/${chatId}?q=${encodeURIComponent(dto.messages[0].content)}&webSearch=${dto.webSearch}`);
};

export const deleteChat = async (chatId: string) => {
  try {
    const { user } = await AuthGuard();
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userId: user.id,
      },
    });

    if (!chat) {
      throw new CustomizedError("Chat not found", 404);
    }

    await prisma.chat.deleteMany({
      where: {
        id: chatId,
        userId: user.id,
      },
    });


    revalidatePath("/");

    return { success: true, message: "Chat deleted successfully" };
  } catch (error) {
    return returnError(error);
  }
};
