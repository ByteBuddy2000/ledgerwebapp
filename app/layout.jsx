import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Tawk from "@/components/Tawk";


const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})



export const metadata = {
  title: "Trump IRS Vault App",
  description: "Trump IRS Vault App authorised by Flare Network",

  icons: {
    icon: "/tiv-logo.png",
    shortcut: "/tiv-logo.png",
    apple: "/tiv-logo.png",
  },
  openGraph: {
    images: ["/tiv-logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (

    <html lang="en" className="dark">
      <body className={`${dmSans.className} antialiased bg-background text-foreground`}>
        {children}
        <Toaster richColors position="top-center" /> {/* ✅ Sonner Toaster here */}
        {/* <Tawk /> */}
        <Tawk />

      </body>
    </html>
  );
}
