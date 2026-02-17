import { SidebarContent } from "@/components/ui/sidebar";
import { SidebarQuickActions } from "./quick-actions";
import { YourChats } from "./your-chats";
import { prisma } from "@/lib/prisma/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/dist/server/request/headers";

export async function SidebarContentComp() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const chats = await prisma.chat.findMany({
    where: {
      userId: session?.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <SidebarContent>
      <SidebarQuickActions />
      <div className="flex-1 overflow-y-auto">
        <YourChats chats={chats} />
      </div>
    </SidebarContent>
  );
}
