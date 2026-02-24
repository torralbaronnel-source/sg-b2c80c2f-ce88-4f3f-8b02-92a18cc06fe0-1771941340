import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/contexts/AuthContext";
import { EventProvider } from "@/contexts/EventContext";
import { AppLayout } from "@/components/Layout/AppLayout";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Public pages that don't need the layout
  const publicPages = ["/login", "/signup", "/forgot-password", "/reset-password", "/"];
  const isPublicPage = publicPages.includes(router.pathname);

  if (isPublicPage) {
    return (
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <EventProvider>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </EventProvider>
    </AuthProvider>
  );
}