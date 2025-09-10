import ClientLayout from "../../components/ClientLayout"; // Import the layout component
import "../globals.css"; // Global styles
import { ConfirmDialog } from "@/components/ConfirmDialog";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-100 h-screen">
        {/* Use the ClientLayout component for the main layout */}
        <ClientLayout>
          {children} {/* Render the content of the page here */}
        </ClientLayout>
      </body>
    </html>
  );
}
