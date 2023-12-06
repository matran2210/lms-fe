import React, { Component } from 'react'

// Định nghĩa các trạng thái của component
enum Status {
  UNMOUNTED = 'unmounted',
  EXITED = 'exited',
  ENTERING = 'entering',
  ENTERED = 'entered',
  EXITING = 'exiting',
}

// Định nghĩa kiểu dữ liệu cho props của component
interface FadeInOutProps {
  // Biến boolean để quyết định có hiển thị component hay không
  show: boolean
  // Thời gian chuyển đổi trạng thái của component (tính bằng mili giây)
  duration: number
  // Tên lớp CSS của component
  className?: string
  // Đối tượng style của component
  style?: React.CSSProperties
  // Nội dung của component
  children: React.ReactNode
}

// Định nghĩa kiểu dữ liệu cho state của component
interface FadeInOutState {
  // Trạng thái hiện tại của component
  status: Status
}

// Định nghĩa các style cho các trạng thái khác nhau của component
const transitionStyles: Record<Status, React.CSSProperties> = {
  [Status.UNMOUNTED]: { opacity: 0 }, // Thêm style cho trạng thái UNMOUNTED
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
}

// Component FadeInOut sử dụng hiệu ứng fade in và fade out khi thay đổi trạng thái
class FadeInOut extends Component<FadeInOutProps, FadeInOutState> {
  static defaultProps: FadeInOutProps // Thêm khai báo kiểu dữ liệu cho defaultProps

  private coverRef: React.RefObject<HTMLDivElement> | null = null
  private elementRef: React.RefObject<HTMLDivElement> | null = null

  constructor(props: FadeInOutProps) {
    super(props)
    this.state = { status: Status.UNMOUNTED }

    this.coverRef = React.createRef()
    this.elementRef = React.createRef()
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
        if (status !== Status.ENTERING && status !== Status.ENTERED) {
          nextStatus = Status.ENTERING
        }
      } else {
        if (status === Status.ENTERING || status === Status.ENTERED) {
          nextStatus = Status.EXITING
        }
      }
    }
    this.updateStatus(nextStatus)
  }

  updateStatus(nextStatus: Status | null) {
    if (nextStatus !== null) {
      if (nextStatus === Status.ENTERING) {
        this.performEnter()
      } else {
        this.performExit()
      }
    } else if (this.state.status === Status.EXITED) {
      this.setState({ status: Status.UNMOUNTED })
    }
  }

  performEnter() {
    this.setState({ status: Status.ENTERING }, () => {
      setTimeout(() => {
        this.setState({ status: Status.ENTERED }, () => {})
      }, 100)
    })
  }

  performExit() {
    if (this.elementRef?.current && this.coverRef?.current) {
      const height = this.elementRef.current?.offsetHeight
      this.coverRef.current.style.minHeight = height + 'px'
    }
    this.setState({ status: Status.EXITING }, () => {
      setTimeout(() => {
        this.setState({ status: Status.EXITED }, () => {})
      }, 0)
    })
  }

  render() {
    const { status } = this.state
    const { children, duration, className, style } = this.props
    return (
      <div className="relative">
        <div
          ref={this.coverRef}
          className={`absolute inset-0 z-50 w-full h-full bg-black opacity-50 ease-in-out transition-all ${
            status !== Status.ENTERED ? '' : 'hidden'
          }`}
        ></div>
        <div
          ref={this.elementRef}
          className={className}
          style={{
            ...style,
            transition: `opacity ${duration}ms ease-in-out`,
          }}
        >
          {children}
        </div>
      </div>
    )
  }
}

FadeInOut.defaultProps = {
  show: false,
  duration: 300,
  children: <></>, // Thêm giá trị cho thuộc tính children
}

export default FadeInOut
