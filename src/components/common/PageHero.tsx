interface PageHeroProps {
  image: string
  title: string
  subtitle?: string
}

function PageHero({
  image,
  title,
  subtitle,
}: PageHeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-green-950">
      <div className="relative w-full">
        <img
          src={image}
          alt={title}
          className="block w-full h-auto"
        />

        {/* Dark overlay for readable text */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/85 via-green-950/45 to-green-950/10" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-bold tracking-[0.2em] text-lime-300 uppercase sm:text-sm">
                Kisaan Mitra
              </p>

              <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>

              {subtitle && (
                <p className="max-w-xl mt-4 text-sm leading-6 text-green-100 sm:text-base">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PageHero