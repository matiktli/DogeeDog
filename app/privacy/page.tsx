import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPage = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen">
        <div className="w-full bg-gradient-to-b from-[var(--secondary)]/5 to-transparent">
          <div className="max-w-3xl mx-auto px-6 py-12">
            <Link 
              href="/" 
              className="inline-flex items-center text-[var(--accent)] hover:text-[var(--accent)]/90 mb-6 transition-all"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>

            <div className="bg-white/50 dark:bg-black/5 rounded-2xl shadow-sm p-8">
              <div className="inline-block px-4 py-2 bg-[var(--accent)]/10 rounded-full mb-6">
                <span className="text-[var(--accent)] font-medium">🔒 Privacy</span>
              </div>
              
              <h1 className="text-5xl font-[var(--font-anchor-jack)] text-[var(--accent)] mb-8">
                Privacy Policy
              </h1>
              
              <p className="text-[var(--foreground)]/80 leading-relaxed mb-8">
                Your privacy is important to us. It is dogee-dog.com&apos;s policy to respect your privacy regarding any information we may collect from you across our website, https://dogee-dog.com, and other sites we own and operate.
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Information We Collect</h2>
                <p className="text-[var(--foreground)]/80 leading-relaxed">
                  We only ask for personal information when we truly need it to provide a service to you. This information may include your name, email address, payment information, and any other details required for processing your requests.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">How We Collect Information</h2>
                <p className="text-[var(--foreground)]/80 leading-relaxed">
                  We collect information by fair and lawful means, with your knowledge and consent. We will let you know why we&apos;re collecting it and how it will be used.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Data Retention</h2>
                <p className="text-[var(--foreground)]/80 leading-relaxed">
                  We only retain collected information for as long as necessary to provide you with the requested service. Any stored data is protected within commercially acceptable means to prevent loss, theft, unauthorized access, disclosure, copying, use, or modification.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Sharing of Information</h2>
                <p className="text-[var(--foreground)]/80 leading-relaxed">
                  We do not share personally identifying information publicly or with third parties, except when required by law or to facilitate payment processing via third-party providers like Stripe.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Third-Party Services</h2>
                <p className="text-[var(--foreground)]/80 leading-relaxed">
                  Our website uses Stripe as a payment processor. Stripe collects, processes, and stores your payment information in compliance with its own Privacy Policy. We recommend reviewing Stripe&apos;s policy to understand how your payment data is handled.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">External Links</h2>
                <p className="text-[var(--foreground)]/80 leading-relaxed">
                  Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites and cannot accept responsibility for their respective privacy policies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Your Rights</h2>
                <p className="text-[var(--foreground)]/80 leading-relaxed">
                  You are free to refuse our request for personal information, with the understanding that we may be unable to provide some services to you.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Data Protection Laws</h2>
                <p className="text-[var(--foreground)]/80 leading-relaxed">
                  We comply with applicable data protection laws, including the EU General Data Protection Regulation (GDPR), where applicable.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Acceptance of Terms</h2>
                <p className="text-[var(--foreground)]/80 leading-relaxed">
                  Your continued use of our website is regarded as acceptance of our practices regarding privacy and personal information. If you have questions about how we handle user data, contact us.
                </p>
              </section>

              <Link 
                href="/" 
                className="inline-flex items-center text-[var(--accent)] hover:text-[var(--accent)]/90 mt-4 transition-all"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPage; 