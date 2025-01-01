import { UnauthNav } from '@/components/navigation/unauth-nav-menu'
import { Footer } from '@/components/navigation/footer'

export default function TermsOfServicePage() {
  return (
    <div className="bg-sand min-h-full">
      <UnauthNav />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-4xl font-display font-bold text-clay-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-clay max-w-none">
          <p className="text-clay-700 mb-8">Last updated: January 2, 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-clay-800 mb-4">1. Agreement to Terms</h2>
            <p>By accessing or using Test Tile Tracker ("the Service"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using the Service.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-clay-800 mb-4">2. Use License</h2>
            <p>We grant you a personal, non-transferable, non-exclusive license to use the Service for tracking and managing your pottery test tiles and related information. This license is subject to these Terms of Service.</p>
            
            <h3 className="text-xl font-display font-semibold text-clay-800 mt-4 mb-2">You may:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Create and manage test tile records</li>
              <li>Upload images of your work</li>
              <li>Organize collections</li>
              <li>Access your data through our interface</li>
            </ul>

            <h3 className="text-xl font-display font-semibold text-clay-800 mt-4 mb-2">You may not:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Copy or modify the Service's software</li>
              <li>Use the Service for any commercial purpose without our consent</li>
              <li>Transfer your account to another person</li>
              <li>Upload malicious content or violate any laws</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-clay-800 mb-4">3. User Content</h2>
            <p>When you upload content to the Service, you:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Retain your ownership rights to your content</li>
              <li>Grant us a license to use, store, and display your content</li>
              <li>Are responsible for the content you upload</li>
              <li>Must have the right to share any content you upload</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-clay-800 mb-4">4. Account Terms</h2>
            <p>To use the Service, you must:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Create an account with accurate information</li>
              <li>Maintain the security of your account</li>
              <li>Promptly notify us of any security breaches</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-clay-800 mb-4">5. Service Modifications</h2>
            <p>We reserve the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Modify or discontinue any part of the Service</li>
              <li>Change our pricing with reasonable notice</li>
              <li>Update these terms as needed</li>
              <li>Limit access to any feature or part of the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-clay-800 mb-4">6. Data Storage</h2>
            <p>While we strive to maintain the Service's reliability:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>We recommend keeping backups of your important data</li>
              <li>We're not responsible for data loss</li>
              <li>We may impose storage limits on accounts</li>
              <li>We may remove inactive accounts after extended periods</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-clay-800 mb-4">7. Prohibited Uses</h2>
            <p>You may not use the Service to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Harass, abuse, or harm others</li>
              <li>Distribute malware or harmful code</li>
              <li>Interfere with the Service's operation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-clay-800 mb-4">8. Disclaimer</h2>
            <p>The Service is provided "as is" without warranties of any kind. We do not guarantee that:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>The Service will always be available</li>
              <li>The Service will be error-free</li>
              <li>Any errors will be corrected</li>
              <li>The Service will meet your specific requirements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-clay-800 mb-4">9. Limitation of Liability</h2>
            <p>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-clay-800 mb-4">10. Termination</h2>
            <p>We may terminate or suspend your account and access to the Service:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>For violations of these terms</li>
              <li>For extended periods of inactivity</li>
              <li>To comply with legal requirements</li>
              <li>For any reason with reasonable notice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-clay-800 mb-4">11. Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws of Australia, without regard to its conflict of law provisions.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-clay-800 mb-4">12. Changes to Terms</h2>
            <p>We may update these terms from time to time. We will notify you of any changes by:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Posting the new terms on this page</li>
              <li>Updating the "Last updated" date</li>
              <li>Sending an email for significant changes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-clay-800 mb-4">13. Contact</h2>
            <p>For any questions about these Terms of Service, please contact us at:</p>
            <p className="mt-2">Email: terms@testtiletracker.com</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
