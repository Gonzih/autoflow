const steps = [
  {
    number: '01',
    title: 'Find a pill',
    description:
      'Browse the library, pick the workflow you need. Each pill is a distilled, battle-tested agent workflow — ready to run.',
  },
  {
    number: '02',
    title: 'Drop your inputs',
    description:
      'Photos, files, folders, data — whatever the pill needs. No configuration, no setup. Just your inputs.',
  },
  {
    number: '03',
    title: 'Get your output',
    description:
      'The agent runs the full workflow from start to finish and delivers production-ready results. Zero code written.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-28 px-6 bg-dark border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <div className="mb-4 text-xs font-mono tracking-widest text-mint uppercase">
          How it works
        </div>

        <h2
          className="text-3xl sm:text-4xl font-bold text-white mb-16"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Three steps. That's it.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative p-8 rounded-2xl border border-white/8 bg-dark-2 hover:border-mint/20 transition-colors"
            >
              <div
                className="text-5xl font-black text-mint/20 mb-6 select-none"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {step.number}
              </div>
              <h3
                className="text-xl font-bold text-white mb-3"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {step.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
