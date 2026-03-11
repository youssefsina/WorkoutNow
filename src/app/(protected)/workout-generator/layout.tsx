import AppShell from "@/components/layout/AppShell";

export default function WorkoutGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
