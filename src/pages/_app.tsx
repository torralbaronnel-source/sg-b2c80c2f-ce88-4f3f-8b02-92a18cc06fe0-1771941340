import type { AppProps } from "next/app";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import "@/styles/globals.css";
import NProgress from "nprogress";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { EventProvider } from "@/contexts/EventContext";
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from "@/components/Layout/AppLayout";
import { SEO } from "@/components/SEO";

// Global Progress Bar Styling
if (typeof window !== "undefined") {
  NProgress.configure({ showSpinner: false, trickleSpeed: 150 });
}

function RouteProgress() {
  const router = useRouter();

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
  }, [router.events]);

  return null;
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Public routes that don't require the dashboard layout
  const publicPages = ["/login", "/signup", "/forgot-password", "/reset-password", "/404", "/terms", "/privacy"];
  const isPublicPage = publicPages.includes(router.pathname);

  return (
    <ThemeProvider>
      <AuthProvider>
        <EventProvider>
          <SEO />
          <RouteProgress />
          {isPublicPage ? (
            <Component {...pageProps} />
          ) : (
            <AppLayout>
              <Component {...pageProps} />
            </AppLayout>
          )}
          <Toaster />
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}