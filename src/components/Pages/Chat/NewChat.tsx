"use client";

import { sendMessageSchema } from "@/schemas/chat";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { createChat } from "@/server/actions/chats";
import ChatInput from "./ChatInput";

const NewChat = () => {
  const form = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: standardSchemaResolver(sendMessageSchema),
    defaultValues: {
      messages: [{ content: "", role: "user" }],
      webSearch: false,
    },
  });

  async function onSubmit(data: z.infer<typeof sendMessageSchema>) {
    await createChat(data);
  }

  return (
    <FormProvider {...form}>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="lg:text-3xl md:text-2xl text-xl font-medium mb-8 text-center">
          Hey, Where should we begin?
        </h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center lg:w-2xl md:w-md sm:sm rounded-full border bg-muted/50 px-4 py-3 gap-3"
        >
          <ChatInput status={form.formState.isReady ? "ready" : "streaming"} />
        </form>
      </div>
    </FormProvider>
  );
};

export default NewChat;
