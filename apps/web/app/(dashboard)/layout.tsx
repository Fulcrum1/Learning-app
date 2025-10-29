import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-auto p-6 w-full">
        <div className="max-w-full w-full">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
