import { UnauthNav } from '@/components/navigation/unauth-nav-menu'
import { Footer } from '@/components/navigation/footer'

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-sand min-h-full">
      <UnauthNav />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-4xl font-display font-bold text-clay-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-clay max-w-none">
          <p className="text-clay-700 mb-8">Last updated: January 2, 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-clay-800 mb-4">Introduction</h2>
            <p>Test Tile Tracker ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our web application.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-clay-800 mb-4">Information We Collect</h2>
            <h3 className="text-xl font-display font-semibold text-clay-800 mb-2">Account Information</h3>
            <p>When you register for an account, we collect:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your email address</li>
              <li>Your name</li>
              <li>Password (securely hashed)</li>
            </ul>

            <h3 className="text-xl font-display font-semibold text-clay-800 mb-2">User Content</h3>
            <p>We store the following information that you create:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Test tile records and images</li>
              <li>Clay body information</li>
              <li>Decoration details</li>
              <li>Collection organization</li>
            </ul>

            <h3 className="text-xl font-display font-semibold text-clay-800 mb-2">Usage Data</h3>
            <p>With your consent, we use Google Analytics to collect:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Pages visited</li>
              <li>Time spent on the application</li>
              <li>General usage patterns</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-clay-800 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>To provide and maintain your account</li>
              <li>To store and organize your test tile records</li>
              <li>To send essential service emails (password reset, welcome messages)</li>
              <li>To improve our application based on usage patterns (with your consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-clay-800 mb-4">Cookies</h2>
            <p>We use cookies for:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Authentication and session management</li>
              <li>Remembering your preferences</li>
              <li>Analytics (optional, requires consent)</li>
            </ul>
            <p>You can control cookie preferences through our cookie consent banner.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-clay-800 mb-4">Data Storage and Security</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>All data is stored securely in the cloud</li>
              <li>Passwords are securely hashed</li>
              <li>We use secure HTTPS connections</li>
              <li>Images are stored securely in cloud storage</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-clay-800 mb-4">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Withdraw analytics consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-clay-800 mb-4">Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Google Analytics (with consent) for usage analysis</li>
              <li>Vercel for image storage</li>
              <li>Amazon SES for email delivery</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-clay-800 mb-4">Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Posting the new policy on this page</li>
              <li>Updating the "Last updated" date</li>
              <li>Sending an email for significant changes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-clay-800 mb-4">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p className="mt-2">Email: privacy@testtiletracker.com</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
