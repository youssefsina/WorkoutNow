import AppShell from "@/components/layout/AppShell";

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
