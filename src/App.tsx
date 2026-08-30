import Layout from './components/layout/Layout'

function App() {
  return (
    <Layout isHomePage={true}>
      {/* Hero Banner - only on home page */}
      <section className="px-4 py-16 bg-gradient-to-r from-green-50 to-orange-50">
        <div className="flex flex-col items-center gap-8 mx-auto max-w-7xl md:flex-row">
          {/* PM Modi Big Placeholder */}
          <div className="flex items-center justify-center w-64 h-64 bg-gray-200 border-2 border-gray-300 rounded-2xl shrink-0">
            <span className="text-6xl">👤</span>
          </div>

          {/* Text Content */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-5xl">
              किसान मित्र
            </h1>
            <p className="mt-4 text-lg text-gray-600 md:text-xl">
              Empowering Indian Farmers with Technology
            </p>
            <p className="mt-2 italic text-gray-500">
              "किसानों की सेवा ही सबसे बड़ी सेवा है"
            </p>
            <div className="flex justify-center gap-3 mt-6 md:justify-start">
              <button className="bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
                Get Started
              </button>
              <button className="border border-green-700 text-green-700 hover:bg-green-50 font-medium px-6 py-2.5 rounded-lg transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default App