import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function LinkedInPopupPage() {
  const router = useRouter()
  const { shareUrl } = router.query

  useEffect(() => {
    if (!shareUrl) return
    const url = `/api/auth/linkedin?popup=true&shareUrl=${encodeURIComponent(
      String(shareUrl),
    )}`
    window.location.href = url
  }, [shareUrl])
}
