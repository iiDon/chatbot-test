import { AppSidebar } from "@/components/Layouts/chatLayout/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col flex-1 h-screen overflow-hidden">
        <span className="block md:hidden">
          <SidebarTrigger />
        </span>
        <section className="flex flex-1 h-full w-full items-center justify-center p-4">{children}</section>
      </main>
    </SidebarProvider>
  );
}
