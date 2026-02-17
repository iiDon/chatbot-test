"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Chat } from "@/lib/prisma/generated/client";
import { MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DeleteChatDialogItem } from "./delete-chat-dialog";
import { cn } from "@/lib/utils";

export function YourChats({ chats }: { chats: Chat[] }) {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <SidebarGroup className={cn(open ? "block" : "hidden")}>
      <SidebarGroupLabel>Your chats</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {chats.length === 0 ? (
            <p className="px-2 text-sm text-muted-foreground">No chats yet</p>
          ) : (
            chats.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === `/${chat.id}`}
                >
                  <Link href={`/${chat.id}`}>
                    {chat.title ?? "Untitled chat"}
                  </Link>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom" align="start">
                    <DropdownMenuItem>
                      <Pencil />
                      <span>Rename</span>
                    </DropdownMenuItem>
                    <DeleteChatDialogItem chat={chat} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
