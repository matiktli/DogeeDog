import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsPage = () => {
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
                <span className="text-[var(--accent)] font-medium">📜 Legal</span>
              </div>
              
              <h1 className="text-5xl font-[var(--font-anchor-jack)] text-[var(--accent)] mb-8">
                Terms and Conditions
              </h1>
              
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Introduction</h2>
                <p className="text-[var(--foreground)]/80 leading-relaxed">
                  By using dogee-dog.com, you confirm your acceptance of, and agree to be bound by, these terms and conditions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Agreement to Terms and Conditions</h2>
                <p className="text-[var(--foreground)]/80 leading-relaxed">
                  This Agreement takes effect on the date on which you first use the dogee-dog.com website or services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">License Duration</h2>
                <p className="text-[var(--foreground)]/80 leading-relaxed">
                  This license is perpetual, with the exception of you breaking any part of this license, in which case you lose all rights under the license.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Product Usage</h2>
                <p className="text-[var(--foreground)]/80 leading-relaxed">
                  By using dogee-dog.com, you agree to receive important product updates from dogee-dog.com via the email you used to register your account. You can opt out of these product updates anytime by clicking the &quot;Unsubscribe&quot; link at the bottom of each email. We only send important updates relevant to your use of our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Disclaimer</h2>
                <p className="text-[var(--foreground)]/80 leading-relaxed">
                  It is not warranted that dogee-dog.com will meet your requirements or that its operation will be uninterrupted or error-free. All express and implied warranties or conditions not stated in this Agreement (including, without limitation, loss of profits, loss or corruption of data, business interruption, or loss of contracts), to the extent permitted by applicable law, are excluded and expressly disclaimed. This Agreement does not affect your statutory rights.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Warranties and Limitation of Liability</h2>
                <p className="text-[var(--foreground)]/80 leading-relaxed">
                  dogee-dog.com does not provide any warranty, guarantee, or other term as to the quality, fitness for purpose, or suitability of the software or services. dogee-dog.com shall not be liable for any indirect, special, or consequential loss, damage, costs, or expenses arising out of or in connection with the provision of goods or services. Notwithstanding other clauses in this Agreement, in the event dogee-dog.com is deemed liable to you, the liability is limited to the amount actually paid by you for the services or products. You hereby release dogee-dog.com from any obligations, liabilities, or claims exceeding this limitation.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Responsibilities</h2>
                <p className="text-[var(--foreground)]/80 leading-relaxed">
                  dogee-dog.com is not responsible for what users do with the content they generate or share through the website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">General Terms and Law</h2>
                <p className="text-[var(--foreground)]/80 leading-relaxed">
                  This Agreement is governed by the laws of the United States. You acknowledge that no joint venture, partnership, employment, or agency relationship exists between you and dogee-dog.com as a result of your use of these services. You agree not to hold yourself out as a representative, agent, or employee of dogee-dog.com.
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

export default TermsPage; 