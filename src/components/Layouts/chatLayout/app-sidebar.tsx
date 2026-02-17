import { Sidebar } from "@/components/ui/sidebar";
import { SidebarHeaderComp } from "./header";
import { SidebarFooterComp } from "./footer";
import { SidebarContentComp } from "./content";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeaderComp />
      <SidebarContentComp />
      <SidebarFooterComp />
    </Sidebar>
  );
}
