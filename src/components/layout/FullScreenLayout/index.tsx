import { ReactElement, ReactNode } from 'react'
import Head from 'next/head'
import clsx from 'clsx'

interface LayoutProps {
  children: ReactNode
  title: string
  className?: string
}

// eslint-disable-next-line import/no-unused-modules
export default function FullScreenLayout(props: LayoutProps): ReactElement {
  const { children, title, className } = props
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className={clsx('min-h-screen bg-white', className)}>{children}</div>
    </>
  )
}
