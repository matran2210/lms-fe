'use client'

import {
  GoogleAnalytics,
  GoogleTagManager,
} from '@next/third-parties/google'
import { useEffect, useState } from 'react'

type DeferredThirdPartyScriptsProps = {
  gaId?: string
  gtmId?: string
}

export default function DeferredThirdPartyScripts({
  gaId = '',
  gtmId = '',
}: DeferredThirdPartyScriptsProps) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (enabled || (!gaId && !gtmId)) return

    const enableScripts = () => setEnabled(true)
    const events = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const

    for (const eventName of events) {
      window.addEventListener(eventName, enableScripts, {
        once: true,
        passive: true,
      })
    }

    return () => {
      for (const eventName of events) {
        window.removeEventListener(eventName, enableScripts)
      }
    }
  }, [enabled, gaId, gtmId])

  if (!enabled) return null

  return (
    <>
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </>
  )
}
