function LoginPage() {
  return (
    <section className="px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-center text-gray-900">Login</h1>
          <p className="mt-1 text-sm text-center text-gray-500">
            Access your Kisaan Mitra account
          </p>
          <div className="mt-8 space-y-5">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email or Phone</label>
              <input
                type="text"
                placeholder="Enter your email or phone"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <a href="#" className="text-green-700 hover:underline">Forgot password?</a>
            </div>
            <button className="w-full bg-green-700 hover:bg-green-800 text-white font-medium py-2.5 rounded-lg transition-colors">
              Login
            </button>
          </div>
          <p className="mt-6 text-sm text-center text-gray-500">
            Don't have an account?{' '}
            <a href="#" className="font-medium text-green-700 hover:underline">Register</a>
          </p>
        </div>
      </div>
    </section>
  )
}

export default LoginPage