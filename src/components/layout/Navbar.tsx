import { Link } from 'react-router'

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 mx-auto max-w-7xl h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-green-700">🌾 Kisaan Mitra</span>
        </Link>

        {/* Nav Items */}
        <div className="items-center hidden gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-gray-700 transition-colors hover:text-green-700">
            Home
          </Link>
          <Link to="/about" className="text-sm font-medium text-gray-700 transition-colors hover:text-green-700">
            About
          </Link>
          <Link to="/services" className="text-sm font-medium text-gray-700 transition-colors hover:text-green-700">
            Services
          </Link>
          <Link to="/contact" className="text-sm font-medium text-gray-700 transition-colors hover:text-green-700">
            Contact
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Language Chooser */}
          <select className="px-2 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded cursor-pointer">
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>

          {/* Login Button */}
          <Link to="/login" className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-1.5 rounded transition-colors">
            Login
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar