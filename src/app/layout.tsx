import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "WorkoutNow | Your Fitness Engine",
  description:
    "Generate custom workout plans tailored to your equipment and goals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#f9fafb] font-display text-slate-900 antialiased dark:bg-[#0f1117] dark:text-slate-100">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}
