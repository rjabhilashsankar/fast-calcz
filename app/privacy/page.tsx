// File: /app/privacy/page.tsx

export const metadata = {
  title: "Privacy Policy - Fastcalculator.app",
  description: "Learn how Fastcalculator.app protects your privacy. No personal data is collected; all calculations happen in your browser. Google Ads compliant.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-12">
        <header className="mb-8 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-gray-800 text-sm sm:text-base font-medium">
            Effective Date: January 20, 2026
          </p>
        </header>

        <section className="space-y-6 bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200">
          <p className="text-gray-900 font-medium">
            <strong>Fastcalculator.app</strong> (“we,” “our,” or “us”) is committed to protecting your privacy. This Privacy Policy explains how we handle information when you visit and use our website.
          </p>

          <h2 className="text-xl font-bold text-gray-900">1. Information We Collect</h2>
          <p className="text-gray-900 font-medium">
            Our calculators are fully <strong>client-side</strong>, meaning all calculations happen in your browser. We <strong>do not collect, store, or share any personal information</strong>, including names, dates of birth, email addresses, or IP addresses.
          </p>

          <h2 className="text-xl font-bold text-gray-900">2. Cookies and Tracking</h2>
          <p className="text-gray-900 font-medium">
            We <strong>do not use cookies or tracking scripts</strong> to collect personal data. Some third-party services, such as ad networks, may use cookies for advertising purposes.
          </p>

          <h2 className="text-xl font-bold text-gray-900">3. Advertising</h2>
          <p className="text-gray-900 font-medium">
            We may display ads from third-party providers, including Google Ads. These providers may collect anonymous information about your interactions with the ads. For more information, see <a href="https://policies.google.com/technologies/ads" className="text-indigo-600 underline">Google Privacy & Terms</a>.
          </p>

          <h2 className="text-xl font-bold text-gray-900">4. Third-Party Services</h2>
          <p className="text-gray-900 font-medium">
            Our website may contain links to other websites. We are <strong>not responsible for the privacy practices</strong> of these external sites.
          </p>

          <h2 className="text-xl font-bold text-gray-900">5. Your Rights</h2>
          <p className="text-gray-900 font-medium">
            Since we do not collect personal data, there are <strong>no personal data rights to exercise</strong>. You can safely use our calculators without providing any information.
          </p>

          <h2 className="text-xl font-bold text-gray-900">6. Security</h2>
          <p className="text-gray-900 font-medium">
            We do not store any user data. All calculations are performed <strong>locally in your browser</strong>, ensuring your data remains private.
          </p>

          <h2 className="text-xl font-bold text-gray-900">7. Changes to This Privacy Policy</h2>
          <p className="text-gray-900 font-medium">
            We may update this Privacy Policy from time to time. The <strong>“Effective Date”</strong> at the top will reflect the most recent update.
          </p>

          <h2 className="text-xl font-bold text-gray-900">8. Contact Us</h2>
          <p className="text-gray-900 font-medium">
            For questions about this Privacy Policy, please contact us at: <a href="mailto:Fastcalculator.app@gmail.com" className="text-indigo-600 underline">fastcalculator.app@gmail.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}