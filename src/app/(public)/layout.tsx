import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CompareBar } from "@/components/catalog/CompareBar";
import { SessionProvider } from "@/components/admin/SessionProvider";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider session={null}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CompareBar />
    </SessionProvider>
  );
}
