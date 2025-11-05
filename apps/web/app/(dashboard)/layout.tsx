import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if(!session || !session.user) {
    return redirect('/login');
  }
  
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <SidebarProvider>
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar user={session?.user.name}/>
          <main className="flex-1 overflow-auto p-6 w-full">
            <div className="max-w-full w-full h-full">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
