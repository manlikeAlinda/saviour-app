import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SessionProvider } from "@/components/admin/SessionProvider";

export const metadata = {
  title: "Admin | Saviour Mechatronics",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <SessionProvider session={session}>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
            <div />
            <div className="text-sm text-gray-500">
              Logged in as <span className="font-medium text-gray-900">{session.user?.name}</span>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
