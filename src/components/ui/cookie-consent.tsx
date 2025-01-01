'use client'

import CookieConsent from 'react-cookie-consent'
import { baseButtonStyles, buttonSizes, buttonVariants } from '../ui/buttons/action-button'

export function CookieConsentBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      enableDeclineButton
      expires={365}
      containerClasses="px-8 shadow-lg"
      style={{ backgroundColor: "#FDFAF7", fontFamily: "degular, sans-serif", color: "#534943", alignItems: "center" }}
      contentStyle={{ margin: "24px 0"}}
      buttonStyle={{ fontFamily: "degular, sans-serif", fontWeight: "500", backgroundColor: "#C5705D", color: "#FAF8F6", borderRadius: "6px", padding: "8px 16px", margin: "24px 0" }}
      declineButtonStyle={{ fontFamily: "degular, sans-serif", fontWeight: "500", backgroundColor: "#FAF8F6", color: "#C5705D", borderColor: "#C5705D", borderWidth: "1px", borderStyle: "solid", borderRadius: "6px", padding: "8px 16px", margin: "24px 12px 24px 0" }}
    >
      <p className="mb-2">This website uses cookies to enhance your experience. By continuing to use this site, you agree to our use of cookies.</p>
      <p>You can read more in our <a href="/privacy-policy" className="underline text-brand">Privacy Policy</a></p>

    </CookieConsent>
  )
}
