import "./global.css";

import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { getSiteTitle, getFavicon } from "@/lib/admin-data";

const queryClient = new QueryClient();

const App = () => {
  const [siteTitle, setSiteTitle] = useState<string>(getSiteTitle());
  const [favicon, setFavicon] = useState<string>(getFavicon());

  useEffect(() => {
    document.title = siteTitle;

    const iconSelector = "link[rel~='icon']";
    let iconElement = document.head.querySelector<HTMLLinkElement>(iconSelector);

    if (!iconElement) {
      iconElement = document.createElement("link");
      iconElement.rel = "icon";
      document.head.appendChild(iconElement);
    }

    iconElement.href = favicon;
  }, [siteTitle, favicon]);

  useEffect(() => {
    const handleMetadataUpdate = () => {
      setSiteTitle(getSiteTitle());
      setFavicon(getFavicon());
    };

    window.addEventListener("site-metadata-updated", handleMetadataUpdate);
    return () => window.removeEventListener("site-metadata-updated", handleMetadataUpdate);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
