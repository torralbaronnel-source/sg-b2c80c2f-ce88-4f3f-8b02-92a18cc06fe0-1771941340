import React from "react";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { EventProvider } from "@/contexts/EventContext";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { AppLayout } from "@/components/Layout/AppLayout";

// Configure NProgress for fast visual feedback
NProgress.configure({ showSpinner: false, trickleSpeed: 200 });

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

  useEffect(() => {
    const handleStart = () => NProgress.start();
    const handleStop = () => NProgress.done();

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  // Public routes: No AppLayout wrapper
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

  // Authenticated pages: Wrap in persistent AppLayout
  return (
    <ThemeProvider defaultTheme="light" storageKey="orchestrix-theme">
      <AuthProvider>
        <EventProvider>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
          <Toaster />
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;