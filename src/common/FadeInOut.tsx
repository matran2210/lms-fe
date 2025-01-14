import { BASE_FONT_SIZE } from '@utils/constants'
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
      this.coverRef.current.style.minHeight = height / BASE_FONT_SIZE + 'rem'
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
          className={`absolute inset-0 z-50 flex h-full w-full items-center justify-center bg-black opacity-50 transition-all ease-in-out ${
            status !== Status.ENTERED ? '' : 'hidden'
          }`}
        >
          <div role="status">
            <svg
              aria-hidden="true"
              className="h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
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
