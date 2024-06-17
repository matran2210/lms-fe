import ReactGA from 'react-ga4'

const initializeGA = () => {
  // Replace with your Measurement ID
  // It ideally comes from an environment variable
  ReactGA.initialize('G-3Y71SB8L7D')
  // Don't forget to remove the console.log() statements
  // when you are done
}

const trackGAEvent = (category: any, action: any, label: any) => {
  // Send GA4 Event
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  })
}

export default initializeGA
export { initializeGA, trackGAEvent }
