import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck } from "lucide-react";

const PrivacyPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Data Privacy Policy | Orchestrix</title>
      </Head>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/login">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
        </div>

        <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">How We Protect Your Data</h2>
            <p>
              At Orchestrix, we take your privacy seriously. We implement robust security protocols 
              to protect against unauthorized access, alteration, or destruction of your personal 
              and financial data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Collection</h2>
            <p>
              We collect information necessary for event coordination, including contact details 
              for clients, vendors, and team members. All financial data is handled with 
              enhanced encryption.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Security Measures</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>End-to-end encryption for sensitive data fields</li>
              <li>Multi-factor authentication (MFA) support</li>
              <li>Regular security audits and penetration testing</li>
              <li>Row Level Security (RLS) at the database level</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Legal Compliance</h2>
            <p>
              We comply with national data protection laws and anti-money laundering regulations. 
              We do not sell your personal data to third parties.
            </p>
          </section>

          <p className="text-sm text-gray-400 pt-8 border-t">
            Last Updated: February 24, 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;