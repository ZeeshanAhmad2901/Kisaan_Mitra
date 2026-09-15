function TopStrip() {
  return (
    <div className="w-full border-b border-orange-200 bg-[#fffaf2]">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center min-h-[78px]">

          {/* Ashoka Stambh - clearly on the left */}
          <div className="flex items-center justify-center w-16 h-16 mr-5 overflow-hidden bg-white border border-orange-200 rounded-full shadow-sm shrink-0">
            <img
              src="/ashoka-stambh.png"
              alt="Ashoka Stambh"
              className="object-contain w-12 h-12"
            />
          </div>

          {/* Government Text */}
          <div className="flex flex-col justify-center">
            <p className="text-lg font-bold leading-tight text-orange-900 sm:text-xl">
              Government of India
            </p>

            <p className="mt-1 text-sm font-medium leading-tight text-orange-700">
              Ashoka Stambh
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default TopStrip