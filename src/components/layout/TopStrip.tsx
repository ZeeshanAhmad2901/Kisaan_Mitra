function TopStrip() {
  return (
    <div className="w-full border-b border-orange-200 bg-[#fffaf2]">
      <div className="flex items-center justify-start px-4 py-3 mx-auto max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 overflow-hidden bg-white border border-orange-300 rounded-full shadow-sm">
            <img
              src="/ashoka-stambh.png"
              alt="Ashoka Stambh"
              className="object-contain w-9 h-9"
            />
          </div>

          <div>
            <p className="text-base font-bold text-orange-800">
              Government of India
            </p>

            <p className="text-xs font-medium text-orange-600">
              Ashoka Stambh
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopStrip