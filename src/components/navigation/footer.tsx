import Link from 'next/link'

const footerSections = {
  legal: {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
    ],
  },
  connect: {
    title: 'Connect',
    links: [
      { name: 'Instagram', href: 'http://instagram.com/test.tile.tracker' },
      { name: 'hello@testtiletracker.com', href: 'mailto:hello@testtiletracker.com' },
    ],
  },
  support: {
    title: 'Support',
    links: [
      { name: 'Ko-fi', href: '#' },
      { name: 'PayPal', href: '#' },
    ],
  },
}

export function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-4 mt-12 mb-6 rounded-2xl border border-solid border-clay-400 sm:px-6">
      <div className="py-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* First Column - About */}
        <div>
          <h2 className="text-xl font-display font-bold text-brand">Test Tile Tracker</h2>
          <p className="text-clay-800 mt-1">
            Build, organise and search your personal library of test tiles, decorations and clay.
          </p>
          <p className="text-sm text-clay-600 mt-6">© {new Date().getFullYear()} Test Tile Tracker</p>
        </div>

        {/* Other Columns */}
        {Object.values(footerSections).map((section) => (
          <div key={section.title} className="space-y-3">
            <h3 className="font-display font-semibold text-lg text-clay-800">{section.title}</h3>
            <ul className="space-y-1">
              {section.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-brand underline hover:text-brand transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  )
}
