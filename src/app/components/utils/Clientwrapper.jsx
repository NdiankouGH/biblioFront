"use client";

import React, { useState } from "react";
import Sidebar from "../Sidebar";
import { usePathname } from "next/navigation";

// Ce composant masque la Sidebar sur /auth/login, /auth/register, /login, /register
export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  
  // Liste des routes où la sidebar doit être masquée
  const hideSidebarRoutes = ["/auth/login", "/auth/register", "/login", "/register"];
  
  // Vérification si le chemin actuel est dans la liste des routes à masquer
  const shouldHideSidebar = hideSidebarRoutes.some(route => 
    pathname && pathname.toLowerCase() === route.toLowerCase()
  );

  return (
    <div className="flex h-screen">
      {!shouldHideSidebar && (
        <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
      )}
      
      <main className={`flex-1 transition-all duration-300 ${!shouldHideSidebar ? (sidebarExpanded ? "md:ml-64" : "md:ml-16") : ""}`}>
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
}