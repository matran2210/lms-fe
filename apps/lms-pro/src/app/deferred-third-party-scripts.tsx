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

    let timeoutId: ReturnType<typeof setTimeout> | undefined
    let idleId: number | undefined

    const enableScripts = () => setEnabled(true)
    const events = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const

    for (const eventName of events) {
      window.addEventListener(eventName, enableScripts, {
        once: true,
        passive: true,
      })
    }

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(enableScripts, { timeout: 3000 })
    } else {
      timeoutId = setTimeout(enableScripts, 3000)
    }

    return () => {
      for (const eventName of events) {
        window.removeEventListener(eventName, enableScripts)
      }

      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      if (idleId && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId)
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
