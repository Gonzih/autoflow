interface Tag {
  label: string
  color: 'mint' | 'purple' | 'blue' | 'orange'
}

interface Pill {
  id: string
  name: string
  description: string
  tags: Tag[]
  inputs: string
  outputs: string
  workflowUrl: string
  stub?: boolean
}

const pills: Pill[] = [
  {
    id: 'photo-to-squarespace',
    name: 'Photo → Squarespace',
    description:
      'Turn a folder of clothing photos into a Squarespace-ready CSV with AI-generated descriptions and hosted image URLs. Goes from raw HEICs to importable listings.',
    tags: [
      { label: 'ecommerce', color: 'mint' },
      { label: 'photos', color: 'purple' },
      { label: 'clothing', color: 'blue' },
    ],
    inputs: 'Folder of photos (HEIC/JPG), named by item',
    outputs: 'Squarespace CSV + hosted image URLs',
    workflowUrl:
      'https://github.com/gonzih/autoflow/blob/main/pills/photo-to-squarespace/WORKFLOW.md',
  },
  {
    id: 'github-pages-image-host',
    name: 'GitHub Pages Image Host',
    description:
      'Host a batch of images on GitHub Pages and get back a list of permanent public URLs. Automates repo creation, image push, and Pages enablement.',
    tags: [
      { label: 'images', color: 'purple' },
      { label: 'hosting', color: 'orange' },
      { label: 'github', color: 'blue' },
    ],
    inputs: 'Folder of images, GitHub username',
    outputs: 'Public CDN URLs for every image',
    workflowUrl:
      'https://github.com/gonzih/autoflow/blob/main/pills/github-pages-image-host/README.md',
    stub: true,
  },
]

const tagColors: Record<Tag['color'], string> = {
  mint: 'bg-mint/10 text-mint border-mint/20',
  purple: 'bg-purple/10 text-purple border-purple/20',
  blue: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  orange: 'bg-orange-400/10 text-orange-400 border-orange-400/20',
}

function PillCard({ pill }: { pill: Pill }) {
  return (
    <div className="flex flex-col p-8 rounded-2xl border border-white/8 bg-dark-2 hover:border-white/15 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3
          className="text-xl font-bold text-white group-hover:text-mint transition-colors"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {pill.name}
        </h3>
        {pill.stub && (
          <span className="shrink-0 text-xs font-mono px-2 py-1 rounded bg-white/5 text-white/40 border border-white/10">
            coming soon
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm leading-relaxed mb-6">
        {pill.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {pill.tags.map((tag) => (
          <span
            key={tag.label}
            className={`text-xs font-mono px-2.5 py-1 rounded border ${tagColors[tag.color]}`}
          >
            {tag.label}
          </span>
        ))}
      </div>

      {/* I/O summary */}
      <div className="flex flex-col gap-2 mb-8 p-4 rounded-xl bg-dark-3 border border-white/5">
        <div className="flex items-start gap-3 text-sm">
          <span className="text-white/30 font-mono shrink-0">IN</span>
          <span className="text-gray-300">{pill.inputs}</span>
        </div>
        <div className="h-px bg-white/5" />
        <div className="flex items-start gap-3 text-sm">
          <span className="text-mint/50 font-mono shrink-0">OUT</span>
          <span className="text-gray-300">{pill.outputs}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto flex gap-3">
        <button
          disabled
          className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm bg-mint/5 text-mint/40 border border-mint/10 cursor-not-allowed"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Run →
        </button>
        <a
          href={pill.workflowUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 px-4 rounded-xl font-semibold text-sm border border-white/10 text-white/60 hover:text-white hover:border-white/25 transition-colors"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          View workflow
        </a>
      </div>
    </div>
  )
}

export default function PillsLibrary() {
  return (
    <section id="pills" className="py-28 px-6 bg-dark-2 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <div className="mb-4 text-xs font-mono tracking-widest text-purple uppercase">
          Pills library
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Pick a workflow. Run it.
          </h2>
          <p className="text-gray-500 text-sm max-w-xs">
            More pills ship regularly. Submit yours via GitHub.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pills.map((pill) => (
            <PillCard key={pill.id} pill={pill} />
          ))}
        </div>
      </div>
    </section>
  )
}
