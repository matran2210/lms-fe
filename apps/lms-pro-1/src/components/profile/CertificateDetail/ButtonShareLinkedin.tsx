import { LinkedinIcon } from '@assets/icons'

export const LinkedInShareButton = ({
  certificateUrl,
  onOpenModalShare,
}: {
  certificateUrl: string
  onOpenModalShare?: () => void
}) => {
  // const handleClick = () => {
  //   onOpenModalShare?.()
  //   const popup = window.open(
  //     `/linkedin-popup?shareUrl=${encodeURIComponent(certificateUrl)}`,
  //     'LinkedInPopup',
  //     'width=600,height=600',
  //   )

  //   window.addEventListener('message', (event) => {
  //     if (event.origin !== window.location.origin) return

  //     if (event.data.status === 'success') {
  //       console.log('🎉 Shared successfully!')
  //     } else {
  //       console.log('❌ Failed to share.')
  //     }
  //   })
  // }

  return (
    <button
      onClick={onOpenModalShare}
      className="items-centertext-base flex gap-2 font-semibold"
    >
      <LinkedinIcon className="shrink-0" /> <span>Share with Linkedin</span>
    </button>
  )
}
