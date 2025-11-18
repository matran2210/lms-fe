export const openLinkedInPopup = (linkedInUrl: string, onClose: () => void) => {
  const popup = window.open(
    linkedInUrl,
    '_blank',
    // 'width=600,height=600,noopener,noreferrer',
    'noopener,noreferrer',
  )
  if (popup) {
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer)
        onClose()
      }
    }, 500)
  }
}
