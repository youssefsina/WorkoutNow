import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

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
    <html lang="en">
      <body className="bg-[#f9fafb] font-display text-slate-900 antialiased">
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}
