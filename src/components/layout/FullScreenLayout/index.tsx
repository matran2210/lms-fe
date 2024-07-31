import { ReactElement, ReactNode } from 'react'
import Head from 'next/head'

interface LayoutProps {
  children: ReactNode
  title: string
}

// eslint-disable-next-line import/no-unused-modules
export default function FullScreenLayout(props: LayoutProps): ReactElement {
  const { children, title } = props
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="min-h-screen bg-white">{children}</div>
    </>
  )
}
