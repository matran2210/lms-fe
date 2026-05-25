'use client'
import NextError from 'next/error'
import { useEffect } from 'react'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    // Lazy import Sentry — tránh kéo toàn bộ @sentry/nextjs server bundle
    // vào compile graph của route / khi cold start
    import('@sentry/nextjs').then(({ captureException }) => {
      captureException(error)
    })
  }, [error])

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  )
}
