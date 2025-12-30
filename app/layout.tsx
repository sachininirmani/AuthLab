import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "AuthLab — Security Sandbox",
  description: "Interactive authentication & authorization playground with visual explanations."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Navbar is a server component. It can check login state. */}
        <Navbar />
        {children}
      </body>
    </html>
  );
}
