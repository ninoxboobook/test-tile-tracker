// Function to enable Google Analytics
export function enableAnalytics() {
  // Enable GA tracking
  window.gtag('consent', 'update', {
    analytics_storage: 'granted'
  })
}

// Function to disable Google Analytics
export function disableAnalytics() {
  // Disable GA tracking
  window.gtag('consent', 'update', {
    analytics_storage: 'denied'
  })
}

// Type definition for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}
