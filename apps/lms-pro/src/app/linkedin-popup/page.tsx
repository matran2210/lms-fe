'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function LinkedInPopupPage() {
  const searchParam = useSearchParams()
  const query = Object.fromEntries(searchParam.entries())
  const { shareUrl } = query

  useEffect(() => {
    if (!shareUrl) return
    const url = `/api/auth/linkedin?popup=true&shareUrl=${encodeURIComponent(
      String(shareUrl),
    )}`
    window.location.href = url
  }, [shareUrl])
}
