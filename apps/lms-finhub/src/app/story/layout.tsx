import { StoryProvider } from '@contexts/StorylineContext'
import { PropsWithChildren } from 'react'

export default function RootLayout({ children }: PropsWithChildren) {
  return <StoryProvider>{children}</StoryProvider>
}
