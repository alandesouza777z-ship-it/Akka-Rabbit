import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <DashboardShell
      user={{
        id: user.id,
        email: user.email || "",
        full_name: profile?.full_name || user.email?.split("@")[0] || "Operator",
        plan_tier: profile?.plan_tier || "starter",
        api_key: profile?.api_key || "",
        domains_limit: profile?.domains_limit || 1,
        requests_limit: profile?.requests_limit || 5000,
      }}
    >
      {children}
    </DashboardShell>
  );
}
