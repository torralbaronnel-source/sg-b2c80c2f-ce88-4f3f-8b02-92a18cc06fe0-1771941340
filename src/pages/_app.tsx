import type { AppProps } from "next/app";
import React, { useEffect } from "react";
import Router, { useRouter } from "next/router";
import "@/styles/globals.css";
import NProgress from "nprogress";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { EventProvider } from "@/contexts/EventContext";
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from "@/components/Layout/AppLayout";

function RouteProgress() {
  const router = useRouter();

  useEffect(() => {
    NProgress.configure({ showSpinner: false, trickleSpeed: 120 });

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
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventProvider>
          <RouteProgress />
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
          <Toaster />
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}