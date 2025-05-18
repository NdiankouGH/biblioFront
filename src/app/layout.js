"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { Theme } from "@radix-ui/themes"; 
import '@radix-ui/themes/styles.css';    
import "./globals.css";
import Sidebar from "@/app/components/Sidebar";
import { useState } from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({ children }) {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    return (
        <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Ma Biblio App</title>
        </head>
        <body className="bg-gray-50 text-gray-900 antialiased">
        <Theme accentColor="violet" radius="large" scaling="105%">
            <div className="flex min-h-screen">
                <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
                <main className={`flex-1 p-4 m-6 transition-all duration-300 ease-in-out ${
                    sidebarExpanded ? 'md:ml-64' : 'md:ml-20'
                }`}>
                    {children}
                </main>
            </div>
        </Theme>
        </body>
        </html>
    );
}
