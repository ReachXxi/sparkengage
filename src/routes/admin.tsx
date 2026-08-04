import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminProvider } from "@/lib/admin-store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "SPARKFAN Admin — multi-tenant campaign control room" },
      {
        name: "description",
        content:
          "Professional admin workspace for SPARKFAN: create campaigns with AI, run rewards, build image/text/number surveys, read responses, quiz and game results, and track top engagers per workspace.",
      },
      { property: "og:title", content: "SPARKFAN Admin — multi-tenant campaign control room" },
      { property: "og:description", content: "Campaigns, rewards, surveys, results and leaderboards for every workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminProvider>
      {/* Required: nested admin routes render here. */}
      <Outlet />
    </AdminProvider>
  );
}
