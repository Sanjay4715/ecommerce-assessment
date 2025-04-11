import { Inter } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navigation from "@/components/Navigation/Navigation";
// import NavigationTracker from "@/components/Navigation/NavigationTracker/NavigationTracker";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <Toaster position="bottom-right" /> */}
          <Navigation>{children}</Navigation>
        </ThemeProvider>
      </body>
    </html>
  );
}
