import React from "react";
import Layout from "../components/Layout";
import { ShieldCheck } from "lucide-react";
import SEOHead from "../components/SEOHead";

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-3 border-l-2 border-orange-500 pl-4">{title}</h2>
    <div className="text-slate-600 text-sm md:text-base leading-relaxed space-y-3 pl-4">{children}</div>
  </section>
);

const Privacy = () => (
  <Layout noPadding={false}>
    <SEOHead
      title="Privacy Policy | Klarify"
      description="Learn how Klarify protects, collects, and manages your personal information when using our academic orientation services."
    />

    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200/80 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
            <p className="text-slate-400 text-xs mt-1 font-medium">Last updated: June 2025</p>
          </div>
        </div>

        <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-10 pb-6 border-b border-slate-100">
          At Klarify, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our platform at <span className="text-orange-500 font-semibold">klarifypath.com</span>.
        </p>

        <Section title="1. Information We Collect">
          <p>We collect the following types of information:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 text-slate-600 text-sm md:text-base">
            <li><span className="text-slate-900 font-semibold">Account Information:</span> When you sign up, we collect your name, email address, and password (stored securely via Supabase Auth).</li>
            <li><span className="text-slate-900 font-semibold">Usage Data:</span> We collect anonymous data about how you interact with the platform to improve the experience.</li>
            <li><span className="text-slate-900 font-semibold">GCE Search Queries:</span> Search names entered on the GCE Results page are used only to retrieve matching results and are not stored against your account.</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>Your information is used to:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 text-slate-600 text-sm md:text-base">
            <li>Provide and improve our academic orientation services</li>
            <li>Personalize your recommendation experience</li>
            <li>Send you important service updates (no spam)</li>
            <li>Secure your account and prevent fraud</li>
          </ul>
        </Section>

        <Section title="3. Data Sharing">
          <p>We do not sell your personal data. We may share it only with:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 text-slate-600 text-sm md:text-base">
            <li><span className="text-slate-900 font-semibold">Supabase</span>, our secure database and authentication provider</li>
            <li><span className="text-slate-900 font-semibold">Vercel</span>, our hosting infrastructure</li>
          </ul>
          <p className="mt-3">All third-party providers we use are bound by their own privacy and security policies.</p>
        </Section>

        <Section title="4. GCE Results Data">
          <p>
            The GCE result data available on Klarify is sourced from official GCE Board publications and processed solely for search functionality. We do not alter or manipulate any official results. This service is provided as-is and is not affiliated with the Cameroon GCE Board.
          </p>
        </Section>

        <Section title="5. Cookies">
          <p>
            We use minimal cookies required for authentication sessions. We do not use tracking or advertising cookies.
          </p>
        </Section>

        <Section title="6. Your Rights">
          <p>You have the right to:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 text-slate-600 text-sm md:text-base">
            <li>Access the data we hold about you</li>
            <li>Request deletion of your account and associated data</li>
            <li>Opt out of any non-essential communications</li>
          </ul>
          <p className="mt-3">To exercise these rights, contact us at <span className="text-orange-500 font-semibold">hello@klarifypath.com</span></p>
        </Section>

        <Section title="7. Security">
          <p>
            We use industry-standard encryption and secure infrastructure (Supabase + Vercel) to protect your data. However, no system is 100% secure, so please use a strong, unique password.
          </p>
        </Section>

        <Section title="8. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of the platform after changes constitutes your acceptance.
          </p>
        </Section>

        <div className="mt-12 p-6 bg-slate-50 border border-slate-200/60 rounded-2xl text-center">
          <p className="text-slate-500 text-sm">Questions about this policy? Reach us at</p>
          <a href="mailto:hello@klarifypath.com" className="text-orange-500 font-bold hover:text-orange-400 transition-colors">hello@klarifypath.com</a>
        </div>
      </div>
    </div>
  </Layout>
);

export default Privacy;
