export const LinkedInShareButton = ({
  certificateUrl,
}: {
  certificateUrl: string
}) => {
  const handleClick = () => {
    const popup = window.open(
      `/linkedin-popup?shareUrl=${encodeURIComponent(certificateUrl)}`,
      'LinkedInPopup',
      'width=600,height=600',
    )

    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return

      if (event.data.status === 'success') {
        alert('🎉 Shared successfully!')
      } else {
        alert('❌ Failed to share.')
      }
    })
  }

  return <button onClick={handleClick}>Share on LinkedIn</button>
}
