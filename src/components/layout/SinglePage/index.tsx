import { ReactElement, ReactNode } from 'react'

interface LayoutProps {
    children: ReactNode
}

export default function SinglePageLayout(props: LayoutProps): ReactElement {
    const { children } = props
    return (
        <div className="overflow-hidden bg-gray-3 h-screen">{children}</div>
    )
}
