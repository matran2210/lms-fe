import Head from 'next/head'
import { ReactElement, ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  title: string
}

export default function SinglePageLayout(props: LayoutProps): ReactElement {
  const { children, title } = props
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="h-screen overflow-hidden bg-[#F1F1F1]">{children}</div>
    </>
  )
}
