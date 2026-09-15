import { Link } from 'react-router'

function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-[#f7faf6]">
      <section className="bg-green-950">
        <div className="max-w-4xl px-4 py-16 mx-auto">
          <p className="text-sm font-bold tracking-widest uppercase text-lime-300">
            Legal
          </p>

          <h1 className="mt-3 text-4xl font-black text-white">
            Terms of Use
          </h1>

          <p className="mt-4 text-green-100">
            Basic terms governing use of the Kisaan Mitra prototype.
          </p>
        </div>
      </section>

      <section className="max-w-4xl px-4 py-12 mx-auto">
        <div className="p-6 space-y-8 bg-white border border-gray-200 shadow-sm rounded-3xl sm:p-10">

          <div>
            <h2 className="text-xl font-black">1. Use of the Platform</h2>
            <p className="mt-3 leading-7 text-gray-600">
              Users should provide accurate information and use Kisaan Mitra
              only for legitimate mandi-related activities.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black">2. Account Responsibility</h2>
            <p className="mt-3 leading-7 text-gray-600">
              Users are responsible for maintaining the confidentiality of
              their login credentials and for activity carried out through
              their account.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black">3. Booking Information</h2>
            <p className="mt-3 leading-7 text-gray-600">
              Slot availability, booking information and mandi operations may
              change. Users should review the information shown on the platform
              before relying on it for travel or operational planning.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black">4. Acceptable Use</h2>
            <p className="mt-3 leading-7 text-gray-600">
              Users should not attempt to misuse, disrupt, reverse engineer or
              gain unauthorized access to the platform or another user's
              account.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black">5. Changes to These Terms</h2>
            <p className="mt-3 leading-7 text-gray-600">
              These terms may be updated as the Kisaan Mitra platform evolves.
            </p>
          </div>

          <Link
            to="/contact"
            className="inline-block px-5 py-3 text-sm font-bold text-white bg-green-700 rounded-xl hover:bg-green-800"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  )
}

export default TermsOfUsePage