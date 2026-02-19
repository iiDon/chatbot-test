"use client";

import { sendMessageSchema } from "@/schemas/chat";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import ChatInput from "./ChatInput";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useGetChat } from "@/hooks/use-chat";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { MessageRole } from "@/lib/prisma/generated/enums";
import { BotMessageSquare } from "lucide-react";
import AssistantMessageBody from "./AssistantMessageBody";
import { useEffect, useRef } from "react";
import { queryClient } from "@/lib/react-query";

const ChatId = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const chatId = pathname.split("/").pop()!;
  const initialQuery = searchParams.get("q");
  const initialWebSearch = searchParams.get("webSearch") === "true";
  const { data, isLoading, isError } = useGetChat(chatId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className="flex items-center justify-center h-full">
        Failed to load chat. Please try again.
      </div>
    );
  }

  const initialMessages: UIMessage[] = (data?.data?.messages ?? []).map(
    (msg) => ({
      id: msg.id,
      role: msg.role as MessageRole,
      parts: [{ type: "text" as const, text: msg.content }],
      createdAt: new Date(msg.createdAt),
      ...(msg.sources && {
        metadata: {
          sources: msg.sources as { url: string; title?: string }[],
        },
      }),
    }),
  );

  return (
    <ChatContent
      key={chatId}
      chatId={chatId}
      initialMessages={initialMessages}
      initialQuery={initialQuery}
      initialWebSearch={initialWebSearch}
    />
  );
};

const ChatContent = ({
  chatId,
  initialMessages,
  initialQuery,
  initialWebSearch,
}: {
  chatId: string;
  initialMessages: UIMessage[];
  initialQuery: string | null;
  initialWebSearch: boolean;
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: standardSchemaResolver(sendMessageSchema),
    defaultValues: {
      messages: [{ content: "", role: "user" }],
      webSearch: initialWebSearch,
    },
  });

  const { messages, sendMessage, status, stop } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: `/api/chat/${chatId}`,
      prepareSendMessagesRequest({ messages }) {
        return { body: { messages, webSearch: form.getValues("webSearch") } };
      },
    }),
    onFinish: () => {
      queryClient.invalidateQueries({ queryKey: ["get-chat", chatId] });
      if (initialMessages.length < 1) {
        router.refresh();
      }
    },
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const hasSentInitial = useRef(false);

  useEffect(() => {
    if (initialQuery && !hasSentInitial.current) {
      hasSentInitial.current = true;
      sendMessage({ text: initialQuery });
      window.history.replaceState({}, "", `/${chatId}`);
    }
  }, [initialQuery, sendMessage, chatId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const onSubmit = (data: z.infer<typeof sendMessageSchema>) => {
    sendMessage({ text: data.messages[0].content });
    form.setValue("messages.0.content", "");
  };

  return (
    <FormProvider {...form}>
      <div className="flex flex-col w-full h-full max-w-3xl mx-auto">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
        >
          {messages.map((message) =>
            message.role === "user" ? (
              <div key={message.id} className="flex justify-end">
                <div className="max-w-[80%] rounded-3xl bg-[#01692B] text-white px-5 py-3">
                  {message.parts.map((part, i) =>
                    part.type === "text" ? (
                      <p
                        key={`${message.id}-${i}`}
                        className="text-sm leading-relaxed"
                      >
                        {part.text}
                      </p>
                    ) : null,
                  )}
                </div>
              </div>
            ) : (
              <div key={message.id} className="flex items-start gap-3">
                <BotAvatar />
                <AssistantMessageBody message={message} status={status} />
              </div>
            ),
          )}

          {status === "streaming" &&
            messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex items-start gap-3">
                <BotAvatar />
                <div className="flex items-center gap-1 pt-1.5">
                  <span className="size-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                  <span className="size-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                  <span className="size-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
        </div>

        <div className="sticky bottom-0 px-4 pb-4 pt-2">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center w-full rounded-full border bg-muted/50 px-4 py-3 gap-3"
          >
            <ChatInput status={status} onStop={stop} />
          </form>
        </div>
      </div>
    </FormProvider>
  );
};

const BotAvatar = () => (
  <div className="shrink-0">
    <div className="size-7 rounded-full bg-foreground flex items-center justify-center">
      <BotMessageSquare className="size-4 text-background" />
    </div>
  </div>
);

export default ChatId;
