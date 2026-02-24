import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, ChevronLeft, Lock, FileText, AlertTriangle, Scale } from "lucide-react";

const TermsPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Terms & Conditions | Orchestrix</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/login">
            <Button variant="ghost" className="gap-2">
              <ChevronLeft className="h-4 w-4" /> Back to Login
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-primary font-bold text-xl italic">
            <Shield className="h-6 w-6" />
            ORCHESTRIX
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-8 md:p-12">
          <header className="mb-10 text-center border-b pb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Terms and Conditions of Use</h1>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Last Updated: February 24, 2026. These Terms govern your access to and use of the Orchestrix Event Coordination Platform.
            </p>
          </header>

          <ScrollArea className="h-[600px] pr-6">
            <div className="space-y-10 text-slate-700 leading-relaxed">
              
              <section>
                <div className="flex items-center gap-2 mb-3 text-slate-900">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold uppercase tracking-wide">1. Acceptance of Agreement</h2>
                </div>
                <p>
                  By creating an account or using Orchestrix, you agree to be bound by these Terms, our Privacy Policy, and all applicable laws. Orchestrix provides mission-critical infrastructure for event coordination. Unauthorized use of this system is strictly prohibited and may result in legal action.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3 text-slate-900">
                  <Lock className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold uppercase tracking-wide">2. Information Security & Access</h2>
                </div>
                <p>
                  You are responsible for maintaining the confidentiality of your credentials. You agree to:
                </p>
                <ul className="list-disc ml-6 mt-3 space-y-2">
                  <li>Use complex passwords as enforced by our security system.</li>
                  <li>Notify Orchestrix immediately of any unauthorized access.</li>
                  <li>Not "scrape," "mine," or attempt to reverse-engineer any part of the platform.</li>
                  <li>Understand that all login attempts are logged for security and forensic purposes.</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3 text-slate-900">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold uppercase tracking-wide">3. Anti-Money Laundering (AML) Compliance</h2>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-amber-500">
                  <p className="text-sm italic">
                    Orchestrix facilitates financial tracking for high-value events. We maintain strict adherence to National Anti-Money Laundering standards.
                  </p>
                </div>
                <p className="mt-3">
                  Users agree to provide accurate financial information. Any suspicious activities, including but not limited to unusual payment patterns or unverified high-value transactions, will be flagged and reported to the relevant authorities as required by law.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3 text-slate-900">
                  <Shield className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold uppercase tracking-wide">4. Data Privacy & Confidentiality</h2>
                </div>
                <p>
                  In accordance with the Data Privacy Act (DPA), all client, vendor, and guest information stored on Orchestrix is treated as highly confidential.
                </p>
                <ul className="list-disc ml-6 mt-3 space-y-2">
                  <li>We implement industry-standard encryption for data at rest and in transit.</li>
                  <li>User data is partitioned at the organization level to prevent cross-account leaks.</li>
                  <li>You acknowledge that you have the right to process the data you upload (e.g., guest lists).</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3 text-slate-900">
                  <Scale className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold uppercase tracking-wide">5. Liability & "Hold Harmless"</h2>
                </div>
                <p>
                  Orchestrix is a management tool. The platform and its owners are not liable for:
                </p>
                <ul className="list-disc ml-6 mt-3 space-y-2">
                  <li>Failures of third-party vendors coordinated through the app.</li>
                  <li>Technical interruptions beyond our control (ISP failures, cloud provider outages).</li>
                  <li>Force Majeure events (natural disasters, government mandates) that affect event execution.</li>
                  <li>Financial losses resulting from incorrect data entry by the User.</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3 text-slate-900">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold uppercase tracking-wide">6. Termination of Service</h2>
                </div>
                <p>
                  Orchestrix reserves the right to suspend or terminate accounts that:
                </p>
                <ul className="list-disc ml-6 mt-3 space-y-2">
                  <li>Violate these security and compliance standards.</li>
                  <li>Attempt to bypass security features or brute-force logins.</li>
                  <li>Fail to verify their identity when requested for AML compliance.</li>
                </ul>
              </section>

              <section className="pt-6 border-t">
                <p className="text-sm text-slate-500 text-center">
                  By using Orchestrix, you acknowledge that you have read, understood, and agreed to be legally bound by these terms.
                </p>
              </section>
            </div>
          </ScrollArea>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Orchestrix Secured Infrastructure. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;