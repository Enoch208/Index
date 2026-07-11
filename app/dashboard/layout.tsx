import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Toaster } from "sonner";

// react-query provider lives in the root layout (global). The dashboard
// shares the marketing site's typeface (Poppins) so type + weights match `/`.
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardLayout>{children}</DashboardLayout>
      <Toaster theme="dark" richColors position="bottom-right" />
    </>
  );
}
