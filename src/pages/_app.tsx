import type { AppProps } from "next/app";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { EventProvider } from "@/contexts/EventContext";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/router";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Public pages that don't need the persistent layout or auth check
  const isPublicPage = ["/login", "/signup", "/forgot-password", "/reset-password", "/terms", "/privacy"].includes(router.pathname);

  if (isPublicPage) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <EventProvider>
            <Component {...pageProps} />
            <Toaster />
          </EventProvider>
        </AuthProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <EventProvider>
          <ProtectedRoute>
            <AppLayout>
              <Component {...pageProps} key={router.pathname} />
            </AppLayout>
          </ProtectedRoute>
          <Toaster />
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}