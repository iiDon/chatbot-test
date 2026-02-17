"use client";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

export function SidebarHeaderComp() {
  const { open } = useSidebar();
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <div
            className={cn(
              "flex items-center  px-2",
              open ? "justify-between" : "justify-center",
            )}
          >
            {open && <Globe className="size-5 " />}
            <SidebarTrigger />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
