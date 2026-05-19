export default function DemoSection() {
  return (
    <section className="py-28 px-6 bg-dark border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <div className="mb-4 text-xs font-mono tracking-widest text-mint uppercase">
          Demo
        </div>

        <div className="mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-3"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            See it in action
          </h2>
          <p className="text-gray-400 text-lg">
            Photo → Squarespace in under 10 minutes
          </p>
        </div>

        {/* Video player */}
        <div className="relative rounded-2xl overflow-hidden border border-white/8 bg-dark-3 aspect-video shadow-2xl">
          <video
            src="/autoflow-demo.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Fallback overlay if video not loaded */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-3 [&:has(video:not([src]))]:flex hidden">
            <div className="text-4xl mb-4">&#9654;</div>
            <p className="text-gray-500 text-sm font-mono">
              autoflow-demo.mp4
            </p>
          </div>
        </div>

        {/* Caption */}
        <p className="mt-6 text-center text-sm text-gray-600 font-mono">
          120 photos → 47 Squarespace product listings, fully automated
        </p>
      </div>
    </section>
  )
}
