import "@/app/globals.css";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "Expense Tracker",
  description: "Track your expenses and earnings",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} max-w-md h-screen mx-auto light`}>
        <div className="w-full h-full">{children}</div>
      </body>
    </html>
  );
}
