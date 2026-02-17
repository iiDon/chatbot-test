import { Prisma } from "@/lib/prisma/generated/client";
import { deleteChat } from "@/server/actions/chats";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

type ChatWithMessages = Prisma.ChatGetPayload<{
  include: {
    messages: true;
  };
}>;

export const useGetChat = (id: string) => {
  return useQuery({
    queryKey: ["get-chat", id],
    staleTime: Infinity,
    enabled: !!id,
    queryFn: async () => {
      const res = await fetch(`/api/chat/${id}`);
      const data = await res.json();
      return data as { success: boolean; data: ChatWithMessages | null };
    },
  });
};

export const useDeleteChat = (id: string) => {
  const pathname = usePathname();
  const chatIdFromPath = pathname.split("/")[1];
  const router = useRouter();
  return useMutation({
    mutationKey: ["delete-chat", id],
    mutationFn: async () => {
      try {
        const response = await deleteChat(id);

        if (!response?.success) {
          throw new Error(response?.message || "Failed to delete chat");
        }

        return response.message;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      if (chatIdFromPath === id) {
        router.push("/");
      }
    },
  });
};
