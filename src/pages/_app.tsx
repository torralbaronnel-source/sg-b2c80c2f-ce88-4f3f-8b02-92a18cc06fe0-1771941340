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
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, MessageSquareWarning } from "lucide-react";

// Global Progress Bar Styling
if (typeof window !== "undefined") {
  NProgress.configure({ showSpinner: false, trickleSpeed: 150 });
}

function ErrorFallback({ error, resetErrorBoundary }: any) {
  const handleReport = () => {
    const subject = encodeURIComponent("Orchestrix System Alert Report");
    const body = encodeURIComponent(
      `User Report from Orchestrix\n\nError Message: ${error?.message || "Unknown"}\n\nStack Trace (Optional):\n${error?.stack || "N/A"}\n\nContext: ${window.location.href}`
    );
    window.location.href = `mailto:support@orchestrix.ai?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="mb-6 rounded-full bg-red-100 p-4">
        <AlertTriangle className="h-12 w-12 text-red-600" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-slate-900">System Alert</h2>
      <p className="mb-8 max-w-md text-slate-600">
        A component in Orchestrix encountered an unexpected error. Don't worry, your session is still secure.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => window.location.reload()} 
          className="bg-[#6264a7] hover:bg-[#4a4c8a]"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Reload Orchestrix
        </Button>
        <Button 
          onClick={handleReport}
          variant="outline"
          className="border-slate-300 text-slate-700 hover:bg-slate-100"
        >
          <MessageSquareWarning className="mr-2 h-4 w-4 text-orange-500" />
          Report Issue
        </Button>
      </div>
      <pre className="mt-8 max-w-lg overflow-auto rounded-lg bg-slate-200 p-4 text-left text-[10px] text-slate-800">
        {error?.message || "Unknown error"}
      </pre>
    </div>
  );
}

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
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