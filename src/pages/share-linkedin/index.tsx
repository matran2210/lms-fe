import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Image from 'next/image'

export default function ShareLinkedInPage() {
  const router = useRouter()
  const { accessToken, urn, asset, shareUrl } = router.query

  const [content, setContent] = useState(
    '🎓 I’ve just earned a new certificate!',
  )

  const handleShare = async () => {
    if (!accessToken || !urn || !asset || !shareUrl) return

    await axios.post('/api/linkedin/share', {
      accessToken,
      urn,
      asset,
      shareUrl,
      content,
    })

    alert('Đăng LinkedIn thành công!')
    window.close() // đóng popup
  }

  if (!accessToken || !urn || !asset || !shareUrl) return <p>Loading...</p>

  return (
    <div className="max-w-md p-4">
      <h2 className="mb-2 text-lg font-semibold">Post to LinkedIn</h2>
      <Image
        src={shareUrl as string}
        alt="Certificate"
        className="mb-3 w-full border"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className="mb-3 w-full border p-2"
      />
      <button
        onClick={handleShare}
        className="bg-blue-600 w-full rounded px-4 py-2 text-white"
      >
        Share now
      </button>
    </div>
  )
}
