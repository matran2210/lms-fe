import En from '@i18n/locales/en/data.json'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

const locales = {
  default: En,
}

const useTrans = () => {
  const { locale = 'en' } = useRouter()
  const trans = useMemo(
    () => require(`@i18n/locales/${locale}/data.json`) || locales['default'],
    [locale]
  )

  return trans
}

export default useTrans
