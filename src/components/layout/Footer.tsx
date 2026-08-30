function Footer() {
  return (
    <footer className="mt-auto bg-gray-100 border-t border-gray-200">
      <div className="px-4 py-6 mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Left - Branding */}
          <div className="text-center md:text-left">
            <span className="font-bold text-green-700">🌾 Kisaan Mitra</span>
            <p className="mt-1 text-xs text-gray-500">
              Empowering Indian Farmers
            </p>
          </div>

          {/* Center - Links */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <a href="#" className="transition-colors hover:text-green-700">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-green-700">
              Terms of Use
            </a>
            <a href="#" className="transition-colors hover:text-green-700">
              Contact Us
            </a>
          </div>

          {/* Right - Copyright */}
          <div className="text-center md:text-right">
            <p className="text-xs text-gray-500">
              © 2025 Kisaan Mitra, Government of India
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer