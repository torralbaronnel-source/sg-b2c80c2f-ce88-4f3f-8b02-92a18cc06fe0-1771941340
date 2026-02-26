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
import { AlertTriangle, RefreshCcw, MessageSquareWarning, Check } from "lucide-react";
import { bugService } from "@/services/bugService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

// Global Progress Bar Styling
if (typeof window !== "undefined") {
  NProgress.configure({ showSpinner: false, trickleSpeed: 150 });
}

function ErrorFallback({ error, resetErrorBoundary }: any) {
  const { user } = useAuth();
  const [isReporting, setIsReporting] = React.useState(false);
  const [reportSent, setReportSent] = React.useState(false);

  // Auto-log the error when it happens
  React.useEffect(() => {
    bugService.logError({
      error_message: error?.message || "Unknown Error",
      stack_trace: error?.stack,
      user_id: user?.id
    });
  }, [error, user]);

  const handleManualReport = async () => {
    setIsReporting(true);
    // Even though we auto-log, manual report adds user intent/priority
    const success = await bugService.logError({
      error_message: `USER_REPORTED: ${error?.message || "Unknown"}`,
      stack_trace: error?.stack,
      user_id: user?.id
    });

    if (success !== null) {
      setReportSent(true);
      toast({
        title: "Report Sent",
        description: "Our engineering team has been notified. Thank you for your help!",
      });
    }
    setIsReporting(false);
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="mb-6 rounded-full bg-red-100 p-4">
        <AlertTriangle className="h-12 w-12 text-red-600" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-slate-900">System Alert</h2>
      <p className="mb-8 max-w-md text-slate-600">
        A component in Orchestrix encountered an unexpected error. Don't worry, your session is secure and the team has been notified.
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
          onClick={handleManualReport}
          disabled={isReporting || reportSent}
          variant="outline"
          className="border-slate-300 text-slate-700 hover:bg-slate-100"
        >
          {reportSent ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              Report Sent
            </>
          ) : (
            <>
              <MessageSquareWarning className="mr-2 h-4 w-4 text-orange-500" />
              {isReporting ? "Sending..." : "Report Issue"}
            </>
          )}
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