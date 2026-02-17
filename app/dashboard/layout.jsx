import MobileTabs from "./components/MobileTabs/MobileTabs";
import { Geist, Geist_Mono } from "next/font/google";
import SessionProviderWrapper from "./SessionProviderWrapper";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Dashboard | QFS Vault App",
  description: "Secure asset dashboard",
};

export default function DashboardLayout({ children }) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`} cz-shortcut-listen="true">
      
      <SessionProviderWrapper>
        {children}
        <MobileTabs />
      </SessionProviderWrapper>
    </div>
  );
}