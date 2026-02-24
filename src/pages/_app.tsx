import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/contexts/AuthContext";
import { EventProvider } from "@/contexts/EventContext";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventProvider>
          <AppLayout>
            <Component {...pageProps} />
            <Toaster />
          </AppLayout>
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}