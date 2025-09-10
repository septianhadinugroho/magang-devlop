import "../globals.css"; // Global styles
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-100 min-h-screen">
          {children} 
          <Toaster />
      </body>
    </html>
  );
}
