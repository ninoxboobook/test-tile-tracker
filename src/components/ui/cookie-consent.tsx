'use client'

import CookieConsent from 'react-cookie-consent'
import { baseButtonStyles, buttonSizes, buttonVariants } from '../ui/buttons/action-button'
import { enableAnalytics, disableAnalytics } from '@/lib/analytics'

export function CookieConsentBanner() {
  const handleAccept = () => {
    enableAnalytics()
  }

  const handleDecline = () => {
    disableAnalytics()
  }

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      enableDeclineButton
      onAccept={handleAccept}
      onDecline={handleDecline}
      expires={365}
      containerClasses="px-8 shadow-lg"
      style={{ backgroundColor: "#FDFAF7", fontFamily: "degular, sans-serif", color: "#534943", alignItems: "center" }}
      contentStyle={{ margin: "24px 0"}}
      buttonStyle={{ fontFamily: "degular, sans-serif", fontWeight: "500", backgroundColor: "#B35844", color: "#FAF8F6", borderRadius: "6px", padding: "8px 16px", margin: "24px 0" }}
      declineButtonStyle={{ fontFamily: "degular, sans-serif", fontWeight: "500", backgroundColor: "#FAF8F6", color: "#B35844", borderColor: "#B35844", borderWidth: "1px", borderStyle: "solid", borderRadius: "6px", padding: "8px 16px", margin: "24px 12px 24px 0" }}
    >
      <p className="mb-2">This website uses cookies to enhance your experience. By continuing to use this site, you agree to our use of cookies.</p>
      <p>You can read more in our <a href="/privacy-policy" className="underline text-brand-dark">Privacy Policy</a></p>
    </CookieConsent>
  )
}
