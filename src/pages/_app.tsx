import React from "react";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { EventProvider } from "@/contexts/EventContext";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";

// Public routes that don’t need the app shell
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/terms",
  "/privacy",
];

function App({ Component, pageProps, router }: AppProps) {
  const isPublicRoute = PUBLIC_ROUTES.includes(router.pathname);
  if (isPublicRoute) {
    return (
      <ThemeProvider defaultTheme="light" storageKey="orchestrix-theme">
        <AuthProvider>
          <EventProvider>
            <Component {...pageProps} />
            <Toaster />
          </EventProvider>
        </AuthProvider>
      </ThemeProvider>
    );
  }

  // Authenticated pages: wrap in global app layout (sidebar + top bar)
  return (
    <ThemeProvider defaultTheme="light" storageKey="orchestrix-theme">
      <AuthProvider>
        <EventProvider>
          <Component {...pageProps} />
          <Toaster />
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;