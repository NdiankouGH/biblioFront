import { Geist, Geist_Mono } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import '@radix-ui/themes/styles.css';
import "./globals.css";
import AuthProvider from "./components/utils/AuthProvider";
import ClientWrapper from "./components/utils/Clientwrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ma Biblio App",
  description: "Ma Biblio App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Theme accentColor="violet" radius="large" scaling="105%">
          <AuthProvider>
            <ClientWrapper>
              {children}
            </ClientWrapper>
          </AuthProvider>
        </Theme>
      </body>
    </html>
  );
}