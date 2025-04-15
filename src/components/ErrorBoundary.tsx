// components/ErrorBoundary.tsx
import React from 'react'

type Props = {
  children: React.ReactNode
}

type State = {
  hasError: boolean
  errorInfo?: any
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    // console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Đã xảy ra lỗi. Vui lòng thử lại sau.</div>
    }

    return this.props.children
  }
}
