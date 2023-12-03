import React, { Component, ReactNode } from 'react'

// Các trạng thái của component
const UNMOUNTED = 'unmounted'
const EXITED = 'exited'
const ENTERING = 'entering'
const ENTERED = 'entered'
const EXITING = 'exiting'

// Định nghĩa kiểu liên minh cho các trạng thái
type Status =
  | typeof UNMOUNTED
  | typeof EXITED
  | typeof ENTERING
  | typeof ENTERED
  | typeof EXITING

// Các kiểu chuyển đổi cho các trạng thái
const transitionStyles: Record<Status, React.CSSProperties> = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
  unmounted: {},
}

// Định nghĩa kiểu cho các props của component
interface FadeInOutProps {
  show: boolean // Biến quyết định hiển thị hay ẩn component
  duration: number // Thời gian chuyển đổi (ms)
  className?: string // Tên lớp CSS cho component
  style?: React.CSSProperties // Kiểu CSS cho component
  children?: ReactNode // Các phần tử con của component
}

// Định nghĩa kiểu cho các state của component
interface FadeInOutState {
  status: Status // Trạng thái hiện tại của component
}

// Component FadeInOut dùng để hiển thị hoặc ẩn các phần tử con theo hiệu ứng mờ dần
class FadeInOut extends Component<FadeInOutProps, FadeInOutState> {
  static defaultProps: { show: boolean; duration: number }
  constructor(props: FadeInOutProps) {
    super(props)

    this.state = { status: UNMOUNTED }
  }

  componentDidMount() {
    const { show } = this.props
    if (show) {
      this.performEnter()
    }
  }

  componentDidUpdate(prevProps: FadeInOutProps) {
    let nextStatus: Status | null = null
    if (prevProps !== this.props) {
      const { status } = this.state
      if (this.props.show) {
        if (status !== ENTERING && status !== ENTERED) {
          nextStatus = ENTERING
        }
      } else {
        if (status === ENTERING || status === ENTERED) {
          nextStatus = EXITING
        }
      }
    }
    this.updateStatus(nextStatus)
  }

  updateStatus(nextStatus: Status | null) {
    if (nextStatus !== null) {
      if (nextStatus === ENTERING) {
        this.performEnter()
      } else {
        this.performExit()
      }
    } else if (this.state.status === EXITED) {
      this.setState({ status: UNMOUNTED })
    }
  }

  performEnter() {
    this.setState({ status: ENTERING }, () => {
      setTimeout(() => {
        this.setState({ status: ENTERED }, () => {})
      }, 0)
    })
  }

  performExit() {
    const { duration } = this.props
    this.setState({ status: EXITING }, () => {
      setTimeout(() => {
        this.setState({ status: EXITED }, () => {})
      }, duration)
    })
  }

  render() {
    const { status } = this.state
    if (status === UNMOUNTED) {
      return null
    }

    const { children, duration, className, style } = this.props
    return (
      <div
        className={className}
        style={{
          ...style,
          transition: `opacity ${duration}ms ease-in-out`,
          opacity: 0.1,
          ...transitionStyles[status],
        }}
      >
        {children}
      </div>
    )
  }
}

// Các giá trị mặc định cho các props
FadeInOut.defaultProps = {
  show: false,
  duration: 300,
}

export default FadeInOut
