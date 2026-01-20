// components/Footer.tsx
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white mt-12 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
        
        {/* Left side */}
        <div className="mb-2 sm:mb-0 text-center sm:text-left">
          © {year} Calcz. All rights reserved.
        </div>

        {/* Right side links */}
        <div className="flex gap-4">
          <a
            href="/privacy"
            className="underline hover:text-indigo-600 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="underline hover:text-indigo-600 transition-colors"
          >
            Terms of Service 
          </a>
        </div>
      </div>
    </footer>
  );
}