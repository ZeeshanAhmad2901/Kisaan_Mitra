import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import PageHero from '../../components/common/PageHero'

function ContactPage() {
  const { t } = useTranslation()

  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-[#f7faf6] text-gray-900">

      {/* ================= HERO BANNER ================= */}
      <PageHero
        image="/Contact.png"
        title="Contact Kisaan Mitra"
        subtitle="Have a question, suggestion or issue? Connect with the Kisaan Mitra team and get the support you need."
      />

      {/* HERO ACTIONS */}
      <section className="px-4 py-8 bg-white border-b border-gray-100">
        <div className="flex flex-wrap justify-center gap-3 mx-auto max-w-7xl">
          <Link
            to="/login"
            className="px-6 py-3 text-sm font-bold text-green-950 transition-all bg-lime-300 rounded-xl hover:bg-lime-200 hover:-translate-y-0.5"
          >
            Get Started
          </Link>

          <Link
            to="/services"
            className="px-6 py-3 text-sm font-semibold text-green-800 transition-all border border-green-200 rounded-xl bg-green-50 hover:bg-green-100"
          >
            Explore Services
          </Link>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="px-4 py-16">
        <div className="grid gap-8 mx-auto max-w-7xl lg:grid-cols-5">

          {/* INFO */}
          <div className="space-y-5 lg:col-span-2">
            <div>
              <p className="text-sm font-bold tracking-widest text-green-700 uppercase">
                Get in Touch
              </p>

              <h2 className="mt-3 text-3xl font-black">
                How can we help?
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                Whether you're a farmer, mandi owner or someone exploring the
                platform, we're here to help.
              </p>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-3xl">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 text-sm font-black text-green-800 bg-green-100 rounded-2xl">
                  01
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Farmer Support
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Questions about booking slots, QR tokens, vehicles,
                    crop prices or your bookings.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-3xl">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 text-sm font-black text-orange-800 bg-orange-100 rounded-2xl">
                  02
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Mandi Owner Support
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Need help with bookings, queue management or processing
                    status?
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-green-950 rounded-3xl">
              <p className="text-sm font-bold tracking-wide uppercase text-lime-300">
                Quick Access
              </p>

              <p className="mt-3 text-sm leading-6 text-green-100">
                You can also explore the platform directly before contacting
                the support team.
              </p>

              <Link
                to="/"
                className="inline-block px-5 py-2.5 mt-5 text-sm font-bold text-green-950 bg-lime-300 rounded-xl hover:bg-lime-200"
              >
                Explore Kisaan Mitra
              </Link>
            </div>
          </div>

          {/* FORM */}
          <div className="lg:col-span-3">
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-3xl sm:p-8">

              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    Send us a message
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Fill in the details below and submit your request.
                  </p>
                </div>

                <div className="items-center justify-center hidden w-12 h-12 text-sm font-black text-green-800 bg-green-100 sm:flex rounded-2xl">
                  KM
                </div>
              </div>

              {submitted && (
                <div className="p-4 mt-6 border border-green-200 bg-green-50 rounded-2xl">
                  <p className="font-bold text-green-800">
                    Message submitted successfully.
                  </p>

                  <p className="mt-1 text-sm text-green-700">
                    Thank you for contacting Kisaan Mitra.
                  </p>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-6"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      {t('contact.name')}
                    </label>

                    <input
                      type="text"
                      required
                      placeholder={t('contact.namePlaceholder')}
                      className="w-full px-4 py-3 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      {t('contact.email')}
                    </label>

                    <input
                      type="email"
                      required
                      placeholder={t('contact.emailPlaceholder')}
                      className="w-full px-4 py-3 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Subject
                  </label>

                  <select
                    className="w-full px-4 py-3 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select a topic</option>
                    <option value="booking">
                      Booking & QR Token
                    </option>
                    <option value="mandi">
                      Mandi Owner Support
                    </option>
                    <option value="prices">
                      Crop Prices
                    </option>
                    <option value="account">
                      Account & Login
                    </option>
                    <option value="feedback">
                      Suggestion / Feedback
                    </option>
                    <option value="other">
                      Other
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    {t('contact.message')}
                  </label>

                  <textarea
                    rows={6}
                    required
                    placeholder={t('contact.messagePlaceholder')}
                    className="w-full px-4 py-3 text-sm bg-white border border-gray-300 resize-none rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-gray-500">
                    Please avoid sharing passwords, OTPs or other sensitive
                    account information.
                  </p>

                  <button
                    type="submit"
                    className="px-6 py-3 text-sm font-bold text-white transition-all bg-green-700 rounded-xl hover:bg-green-800 hover:-translate-y-0.5"
                  >
                    {t('contact.send')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* SUPPORT OPTIONS */}
      <section className="px-4 py-20 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-bold tracking-widest text-green-700 uppercase">
              Support Options
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Find the right place to start.
            </h2>
          </div>

          <div className="grid gap-5 mt-10 md:grid-cols-3">
            <div className="p-6 border border-gray-200 rounded-3xl">
              <div className="flex items-center justify-center w-12 h-12 text-sm font-black text-green-800 bg-green-100 rounded-2xl">
                F
              </div>

              <h3 className="mt-5 text-lg font-black">
                Farmer Help
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Learn more about booking a mandi slot and tracking your
                bookings.
              </p>

              <Link
                to="/farmer/book-slot"
                className="inline-block mt-5 text-sm font-bold text-green-700 hover:underline"
              >
                Book a slot →
              </Link>
            </div>

            <div className="p-6 border border-gray-200 rounded-3xl">
              <div className="flex items-center justify-center w-12 h-12 text-sm font-black text-orange-800 bg-orange-100 rounded-2xl">
                M
              </div>

              <h3 className="mt-5 text-lg font-black">
                Mandi Owner Help
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Access your dashboard and manage queue and booking operations.
              </p>

              <Link
                to="/login"
                className="inline-block mt-5 text-sm font-bold text-orange-700 hover:underline"
              >
                Open login →
              </Link>
            </div>

            <div className="p-6 border border-gray-200 rounded-3xl">
              <div className="flex items-center justify-center w-12 h-12 text-sm font-black text-blue-800 bg-blue-100 rounded-2xl">
                I
              </div>

              <h3 className="mt-5 text-lg font-black">
                Explore the Platform
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                See how Kisaan Mitra connects booking, mandi operations and
                market information.
              </p>

              <Link
                to="/about"
                className="inline-block mt-5 text-sm font-bold text-blue-700 hover:underline"
              >
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl p-8 mx-auto overflow-hidden text-center bg-gradient-to-r from-green-800 to-emerald-700 rounded-3xl sm:p-12">
          <p className="text-sm font-bold tracking-widest uppercase text-lime-300">
            Kisaan Mitra Support
          </p>

          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            Need help with your mandi journey?
          </h2>

          <p className="max-w-2xl mx-auto mt-4 text-green-100">
            Explore the platform or send us a message whenever you need
            assistance.
          </p>

          <Link
            to="/"
            className="inline-block py-3 text-sm font-bold px-7 mt-7 text-green-950 bg-lime-300 rounded-xl hover:bg-lime-200"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  )
}

export default ContactPage