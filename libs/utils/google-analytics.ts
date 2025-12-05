import ReactGA from 'react-ga4'

const initializeGA = () => {
  // Replace with your Measurement ID
  // It ideally comes from an environment variable
  ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '')
  // Don't forget to remove the console.log() statements
  // when you are done
}

const trackGAEvent = (action: string) => {
  // Send GA4 Event
  ReactGA.event({
    category: action,
    action: action,
    label: action,
  })
}

export default initializeGA
export { initializeGA, trackGAEvent }
