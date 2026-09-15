import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import PageHero from '../../components/common/PageHero'

const capabilities = [
  {
    number: '01',
    title: 'Smart Slot Booking',
    description:
      'Farmers can select a mandi, choose an available time slot and plan their visit before reaching the market.',
  },
  {
    number: '02',
    title: 'Digital QR Token',
    description:
      'Every confirmed booking can generate a digital token that helps connect the farmer with the mandi workflow.',
  },
  {
    number: '03',
    title: 'Queue Management',
    description:
      'Mandi operators can monitor arrivals and move bookings through different processing stages.',
  },
  {
    number: '04',
    title: 'Market Price Visibility',
    description:
      'Farmers can view mandi-wise crop prices and use the information while planning their visit.',
  },
  {
    number: '05',
    title: 'Vehicle & Crop Details',
    description:
      'Booking information can include the farmer, crop, quantity and registered vehicle for smoother processing.',
  },
  {
    number: '06',
    title: 'Transparent Workflow',
    description:
      'A connected digital workflow helps organize booking, arrival and processing information in one platform.',
  },
]

function AboutPage() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen bg-[#f7faf6] text-gray-900">
      {/* ================= HERO BANNER ================= */}
      <PageHero
        image="/About.png"
        title="About Kisaan Mitra"
        subtitle="Empowering farmers through transparent, organized and technology-driven mandi services."
      />

      {/* ================= INTRO ================= */}
      <section className="px-4 py-16 bg-white">
        <div className="grid items-center gap-10 mx-auto max-w-7xl lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold tracking-widest text-green-700 uppercase">
              Our Purpose
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Making the mandi journey more organized.
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              {t('about.description')}
            </p>

            <p className="mt-4 leading-7 text-gray-600">
              Instead of treating booking, arrival and queue handling as
              disconnected activities, Kisaan Mitra brings them together into a
              single workflow that can be experienced by both farmers and mandi
              operators.
            </p>

            <Link
              to="/register"
              className="inline-block px-6 py-3 text-sm font-bold text-white transition-colors bg-green-700 mt-7 rounded-xl hover:bg-green-800"
            >
              Get Started
            </Link>
          </div>

          <div className="relative">
            <div className="p-6 border border-green-100 bg-green-50 rounded-3xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-white shadow-sm rounded-2xl">
                  <p className="text-3xl font-black text-green-800">01</p>
                  <p className="mt-2 text-sm font-semibold text-gray-900">
                    Book
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Reserve an appropriate mandi slot.
                  </p>
                </div>

                <div className="p-5 bg-white shadow-sm rounded-2xl">
                  <p className="text-3xl font-black text-green-800">02</p>
                  <p className="mt-2 text-sm font-semibold text-gray-900">
                    Token
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Receive a digital booking token.
                  </p>
                </div>

                <div className="p-5 bg-white shadow-sm rounded-2xl">
                  <p className="text-3xl font-black text-green-800">03</p>
                  <p className="mt-2 text-sm font-semibold text-gray-900">
                    Arrive
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Reach the mandi with your booking details.
                  </p>
                </div>

                <div className="p-5 bg-white shadow-sm rounded-2xl">
                  <p className="text-3xl font-black text-green-800">04</p>
                  <p className="mt-2 text-sm font-semibold text-gray-900">
                    Process
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Move through the organized workflow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= THE PROBLEM ================= */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold tracking-widest text-orange-700 uppercase">
              The Challenge
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Turning a fragmented mandi visit into a connected workflow.
            </h2>
          </div>

          <div className="grid gap-5 mt-10 md:grid-cols-3">
            <div className="p-6 bg-white border border-gray-200 rounded-2xl">
              <div className="flex items-center justify-center w-12 h-12 text-orange-700 bg-orange-100 rounded-xl">
                01
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Unplanned arrivals
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Farmers may have limited visibility into suitable arrival times
                before travelling to a mandi.
              </p>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-2xl">
              <div className="flex items-center justify-center w-12 h-12 text-orange-700 bg-orange-100 rounded-xl">
                02
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Waiting and queues
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Manual coordination can make arrivals and processing harder to
                organize.
              </p>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-2xl">
              <div className="flex items-center justify-center w-12 h-12 text-orange-700 bg-orange-100 rounded-xl">
                03
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Disconnected information
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Booking, crop details, vehicle information and processing
                status may exist in separate workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SOLUTION ================= */}
      <section className="px-4 py-20 bg-green-950">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold tracking-widest uppercase text-lime-300">
              Our Solution
            </p>

            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              One digital platform connecting the complete mandi journey.
            </h2>

            <p className="mt-5 leading-7 text-green-100">
              Kisaan Mitra connects the farmer-facing booking experience with
              the mandi-side operational workflow, helping both sides work with
              the same booking information.
            </p>
          </div>

          <div className="grid gap-5 mt-10 md:grid-cols-2">
            <div className="border p-7 rounded-3xl border-white/10 bg-white/10">
              <p className="text-sm font-bold tracking-wide uppercase text-lime-300">
                Farmer Experience
              </p>

              <h3 className="mt-3 text-2xl font-black text-white">
                Plan before you arrive.
              </h3>

              <ul className="mt-5 space-y-3 text-sm text-green-100">
                <li>✓ Select mandi and slot</li>
                <li>✓ Add crop and vehicle details</li>
                <li>✓ Receive digital QR confirmation</li>
                <li>✓ Track booking information</li>
                <li>✓ View mandi crop prices</li>
              </ul>
            </div>

            <div className="border p-7 rounded-3xl border-white/10 bg-white/10">
              <p className="text-sm font-bold tracking-wide text-orange-300 uppercase">
                Mandi Owner Experience
              </p>

              <h3 className="mt-3 text-2xl font-black text-white">
                Organize arrivals and processing.
              </h3>

              <ul className="mt-5 space-y-3 text-sm text-green-100">
                <li>✓ Monitor today's arrivals</li>
                <li>✓ View confirmed bookings</li>
                <li>✓ Manage queue movement</li>
                <li>✓ Update processing status</li>
                <li>✓ Coordinate the mandi workflow</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CAPABILITIES ================= */}
      <section className="px-4 py-20 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-bold tracking-widest text-green-700 uppercase">
              Platform Capabilities
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Built around the real mandi workflow.
            </h2>
          </div>

          <div className="grid gap-5 mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability) => (
              <div
                key={capability.number}
                className="p-6 transition-all border border-gray-200 rounded-2xl hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-center text-sm font-black text-green-800 bg-green-100 w-11 h-11 rounded-xl">
                  {capability.number}
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  {capability.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {capability.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= THREE STAKEHOLDERS ================= */}
      <section className="px-4 py-20 bg-[#f7faf6]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-bold tracking-widest text-green-700 uppercase">
              Connected Ecosystem
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Designed around shared information.
            </h2>
          </div>

          <div className="grid gap-6 mt-12 md:grid-cols-3">
            <div className="bg-white border border-green-100 p-7 rounded-3xl">
              <div className="flex items-center justify-center text-xl font-black text-green-800 bg-green-100 w-14 h-14 rounded-2xl">
                F
              </div>

              <h3 className="mt-5 text-xl font-black">
                Farmers
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Get a more planned and predictable mandi visit with digital
                booking and token information.
              </p>
            </div>

            <div className="bg-white border border-orange-100 p-7 rounded-3xl">
              <div className="flex items-center justify-center text-xl font-black text-orange-800 bg-orange-100 w-14 h-14 rounded-2xl">
                M
              </div>

              <h3 className="mt-5 text-xl font-black">
                Mandi Owners
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Manage arrivals, queue movement and processing status from a
                connected operational dashboard.
              </p>
            </div>

            <div className="bg-white border border-blue-100 p-7 rounded-3xl">
              <div className="flex items-center justify-center text-xl font-black text-blue-800 bg-blue-100 w-14 h-14 rounded-2xl">
                G
              </div>

              <h3 className="mt-5 text-xl font-black">
                Governance
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                A structured digital workflow can provide clearer operational
                information across the mandi ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VISION ================= */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm font-bold tracking-widest text-green-700 uppercase">
            Our Vision
          </p>

          <h2 className="mt-4 text-3xl font-black sm:text-4xl">
            Make every mandi visit more planned, connected and transparent.
          </h2>

          <p className="max-w-3xl mx-auto mt-5 leading-7 text-gray-600">
            Kisaan Mitra aims to create a digital-first mandi experience where
            farmers can plan their visits and mandi teams can organize arrivals
            using a shared operational workflow.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link
              to="/register"
              className="px-6 py-3 text-sm font-bold text-white bg-green-700 rounded-xl hover:bg-green-800"
            >
              Create an Account
            </Link>

            <Link
              to="/"
              className="px-6 py-3 text-sm font-semibold text-green-800 border border-green-700 rounded-xl hover:bg-green-50"
            >
              Explore Kisaan Mitra
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER CTA ================= */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl p-8 mx-auto overflow-hidden text-center bg-gradient-to-r from-green-800 to-emerald-700 rounded-3xl sm:p-12">
          <p className="text-sm font-bold tracking-widest uppercase text-lime-300">
            Kisaan Mitra
          </p>

          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            A connected digital journey from
            <span className="block text-lime-300">
              booking to mandi processing.
            </span>
          </h2>

          <p className="max-w-2xl mx-auto mt-4 text-green-100">
            Explore the platform and experience the workflow built for farmers
            and mandi operators.
          </p>

          <Link
            to="/farmer/book-slot"
            className="inline-block py-3 text-sm font-bold px-7 mt-7 text-green-950 bg-lime-300 rounded-xl hover:bg-lime-200"
          >
            Start Your Mandi Journey
          </Link>
        </div>
      </section>
    </main>
  )
}

export default AboutPage