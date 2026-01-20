// File: /app/terms/page.tsx

export const metadata = {
  title: "Terms and Conditions - Fastcalculator.app",
  description: "Read the Terms and Conditions for using Fastcalculator.app. Free online calculators, client-side processing, and Google Ads compliant.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-12">
        <header className="mb-8 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Terms and Conditions
          </h1>
          <p className="text-gray-800 text-sm sm:text-base font-medium">
            Effective Date: January 20, 2026
          </p>
        </header>

        <section className="space-y-6 bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200">
          <p className="text-gray-900 font-medium">
            Welcome to <strong>Fastcalculator.app</strong> (“we,” “our,” or “us”). By accessing or using our website, you agree to comply with and be bound by these Terms and Conditions. Please read them carefully.
          </p>

          <h2 className="text-xl font-bold text-gray-900">1. Use of Our Website</h2>
          <p className="text-gray-900 font-medium">
            Our calculators are provided for personal, educational, or informational purposes only. You may use them at your own risk. We do not guarantee results for professional, medical, legal, or financial purposes.
          </p>

          <h2 className="text-xl font-bold text-gray-900">2. Client-Side Processing</h2>
          <p className="text-gray-900 font-medium">
            All calculations are performed entirely in your browser. We do not store or process any personal data on our servers. Using our website does not require registration or submission of personal information.
          </p>

          <h2 className="text-xl font-bold text-gray-900">3. Intellectual Property</h2>
          <p className="text-gray-900 font-medium">
            All content, design, code, and graphics on Fastcalculator.app are protected under copyright and intellectual property laws. You may not reproduce, distribute, or modify our content without explicit permission.
          </p>

          <h2 className="text-xl font-bold text-gray-900">4. Advertisements</h2>
          <p className="text-gray-900 font-medium">
            Our website may display third-party advertisements, including Google Ads. Advertisers may collect non-personal, anonymous data as outlined in their privacy policies. We do not control ad content or behavior.
          </p>

          <h2 className="text-xl font-bold text-gray-900">5. Limitation of Liability</h2>
          <p className="text-gray-900 font-medium">
            Fastcalculator.app is provided “as is” without warranties of any kind. We are not liable for any direct, indirect, incidental, or consequential damages arising from the use of our calculators or reliance on their results.
          </p>

          <h2 className="text-xl font-bold text-gray-900">6. Links to Other Websites</h2>
          <p className="text-gray-900 font-medium">
            Our site may contain links to external websites. We are not responsible for the content or practices of these third-party sites. Visiting such sites is at your own risk.
          </p>

          <h2 className="text-xl font-bold text-gray-900">7. Modifications to Terms</h2>
          <p className="text-gray-900 font-medium">
            We may update these Terms and Conditions periodically. The <strong>Effective Date</strong> at the top reflects the most recent version. Continued use of the website indicates acceptance of any changes.
          </p>

          <h2 className="text-xl font-bold text-gray-900">8. Governing Law</h2>
          <p className="text-gray-900 font-medium">
            These Terms are governed by the laws of India. Any disputes arising from the use of Fastcalculator.app shall be subject to the exclusive jurisdiction of the courts in India.
          </p>

          <h2 className="text-xl font-bold text-gray-900">9. Contact Us</h2>
          <p className="text-gray-900 font-medium">
            For questions regarding these Terms, please contact us at: <a href="mailto:fastcalculator.app@gmail.com" className="text-indigo-600 underline">fastcalculator.app@gmail.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}