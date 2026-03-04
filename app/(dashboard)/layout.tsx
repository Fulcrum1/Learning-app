import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/Sidebar";
import AppFooter from "@/components/Layout/AppFooter";
import AppHeader from "@/components/Layout/AppHeader";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { LanguageProvider } from "@/components/Global/LanguageProvider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || !session.user) {
    return redirect("/login");
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <SidebarProvider>
        <LanguageProvider>
          <div className="flex flex-1 overflow-hidden">
            <div className="hidden md:block">
              <AppSidebar user={session?.user.name} />
            </div>
            <div className="block md:hidden">
              <AppHeader />
            </div>
            <main className="overflow-auto mt-16 md:mt-0 mb-16 md:mb-0 w-full">
              <div className="max-w-full w-full h-full">{children}</div>
            </main>
          </div>
          <div className="md:hidden fixed bottom-0 w-full">
            <AppFooter />
          </div>
        </LanguageProvider>
      </SidebarProvider>
    </div>
  );
}
