import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { ChevronDown } from "lucide-react";
import { headers } from "next/headers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogoutDialogItem } from "./logout-button";

export async function SidebarFooterComp() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="h-auto w-full py-2">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>
                      {session?.user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {session?.user.name}
                    </span>
                    <span className="text-xs text-muted-foreground">Plus</span>
                  </div>
                </div>
                <ChevronDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="min-w-56">
              <LogoutDialogItem email={session?.user.email} />
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
