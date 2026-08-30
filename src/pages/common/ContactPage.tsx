function ContactPage() {
  return (
    <section className="px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900">Contact Us</h1>
        <p className="mt-3 text-center text-gray-600">
          We're here to help Indian farmers
        </p>
        <div className="p-8 mt-10 bg-white border border-gray-200 rounded-lg">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block mb-1 text-sm font-medium text-gray-700">Message</label>
            <textarea
              rows={5}
              placeholder="Write your message..."
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button className="mt-6 bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
            Send Message
          </button>
        </div>
      </div>
    </section>
  )
}

export default ContactPage