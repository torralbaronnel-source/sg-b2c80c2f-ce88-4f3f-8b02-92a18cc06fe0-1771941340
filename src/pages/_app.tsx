import type { AppProps } from "next/app";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { EventProvider } from "@/contexts/EventContext";
import { Toaster } from "@/components/ui/toaster";
import { SEO } from "@/components/SEO";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useRouter } from "next/router";
import "@/styles/globals.css";

// Pages that should NOT have the AppLayout (Auth pages, Landing, etc.)
const PUBLIC_PAGES = ["/login", "/signup", "/forgot-password", "/reset-password", "/terms", "/privacy"];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isPublicPage = PUBLIC_PAGES.includes(router.pathname);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="orchestrix-theme">
      <AuthProvider>
        <EventProvider>
          <SEO 
            title="Orchestrix | Neural Production Management"
            description="High-performance event production and logistics orchestration."
          />
          {isPublicPage ? (
            <Component {...pageProps} />
          ) : (
            <ProtectedRoute>
              <AppLayout>
                <Component {...pageProps} />
              </AppLayout>
            </ProtectedRoute>
          )}
          <Toaster />
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}