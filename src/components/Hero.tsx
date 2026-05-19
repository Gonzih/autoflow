export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-dark">
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(110,231,183,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Wordmark */}
      <div className="mb-12 text-sm font-mono tracking-widest text-gray-muted uppercase">
        autoflow
      </div>

      {/* Main headline */}
      <h1
        className="text-center max-w-4xl text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      >
        Agentic workflows,{' '}
        <span className="text-mint">packaged for humans.</span>
      </h1>

      {/* Subtext */}
      <p className="mt-8 max-w-xl text-center text-lg sm:text-xl text-gray-400 leading-relaxed">
        Pills are distilled Claude Code intelligence. Drop in your inputs. Get
        your output.{' '}
        <span className="text-gray-200 font-medium">Zero code.</span>
      </p>

      {/* CTAs */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <a
          href="#pills"
          className="px-8 py-4 rounded-xl font-semibold text-base bg-mint text-dark transition-all hover:bg-mint/90 hover:scale-105 active:scale-95"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Browse Pills →
        </a>
        <a
          href="https://github.com/gonzih/autoflow"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 rounded-xl font-semibold text-base border border-white/10 text-white/80 hover:border-white/25 hover:text-white transition-all hover:bg-white/5"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Submit a Pill
        </a>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
        <span className="text-xs font-mono tracking-wider">scroll</span>
        <svg
          width="16"
          height="24"
          viewBox="0 0 16 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 0v20M2 14l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  )
}
