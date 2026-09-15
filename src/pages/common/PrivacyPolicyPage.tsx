import { Link } from 'react-router'

function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f7faf6] text-gray-900">
      <section className="bg-green-950">
        <div className="max-w-4xl px-4 py-16 mx-auto">
          <p className="text-sm font-bold tracking-widest uppercase text-lime-300">
            Legal
          </p>

          <h1 className="mt-3 text-4xl font-black text-white">
            Privacy Policy
          </h1>

          <p className="mt-4 text-green-100">
            Information about how Kisaan Mitra handles information provided
            through the platform.
          </p>
        </div>
      </section>

      <section className="max-w-4xl px-4 py-12 mx-auto">
        <div className="p-6 space-y-8 bg-white border border-gray-200 shadow-sm rounded-3xl sm:p-10">
          <section>
            <h2 className="text-xl font-black">
              1. Information We Collect
            </h2>
            <p className="mt-3 leading-7 text-gray-600">
              Kisaan Mitra may collect information such as name, phone number,
              email address, crop details, vehicle information and booking
              details when you use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black">
              2. How Information Is Used
            </h2>
            <p className="mt-3 leading-7 text-gray-600">
              Information may be used to create accounts, process bookings,
              generate digital tokens, manage mandi workflows and provide
              platform-related services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black">
              3. Data Protection
            </h2>
            <p className="mt-3 leading-7 text-gray-600">
              Appropriate technical and organizational measures should be used
              to protect account and booking information from unauthorized
              access or misuse.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black">
              4. Third-Party Services
            </h2>
            <p className="mt-3 leading-7 text-gray-600">
              The platform may integrate with external services where required
              for specific functionality. Their respective terms may also
              apply.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black">
              5. Contact
            </h2>
            <p className="mt-3 leading-7 text-gray-600">
              Questions regarding privacy can be submitted through the Contact
              page.
            </p>
          </section>

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

export default PrivacyPolicyPage