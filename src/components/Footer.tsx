export default function Footer() {
  return (
    <footer className="py-16 px-6 bg-dark border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-sm">
          <span
            className="font-bold text-white"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            autoflow
          </span>
          <span className="text-white/20 hidden sm:inline">·</span>
          <span className="text-gray-500">agentic workflows for humans</span>
          <span className="text-white/20 hidden sm:inline">·</span>
          <span className="text-gray-600 font-mono text-xs">MIT</span>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <a
            href="https://github.com/gonzih/autoflow"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition-colors font-mono text-xs"
          >
            github.com/gonzih/autoflow
          </a>
        </div>
      </div>
    </footer>
  )
}
