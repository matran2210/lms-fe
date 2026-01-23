import { AlertTriagle } from '@lms/assets'
import { SOCIAL_LINK } from '@lms/core'
import { SappModalV3 } from '@lms/ui'
import dayjs from 'dayjs'

interface IProps {
  open: boolean
  handleCancel: () => void
  type?: 'NOT_OPEN_YET' | 'EXPIRED'
  start_time?: string
}

const TestAnnouncementModal = ({
  open,
  handleCancel,
  type,
  start_time,
}: IProps) => {
  // TEST EXPIRED
  if (type === 'EXPIRED') {
    return (
      <SappModalV3
        handleClose={() => handleCancel()}
        open={open}
        showCancelButton={false}
        cancelButtonCaption="Quit"
        header={'Test Expired'}
        buttonSize="extra"
        okButtonCaption={'Quit'}
        fullWidthBtn
        icon={<AlertTriagle />}
        handleCancel={handleCancel}
        onOk={handleCancel}
      >
        <p className="mt-6">
          The time for this test has ended, you can no longer submit answers.
          For further support, please contact SAPP Academy via{' '}
          <a
            href={SOCIAL_LINK.FACEBOOK}
            className="text-primary"
            target="_blank"
            rel="noreferrer"
          >
            Facebook
          </a>
          , or hotline <span className="text-primary">19002225</span>.
        </p>
      </SappModalV3>
    )
  }

  // TEST UNOPENED
  if (type === 'NOT_OPEN_YET') {
    return (
      <SappModalV3
        handleClose={() => handleCancel()}
        open={open}
        showCancelButton={false}
        handleCancel={handleCancel}
        onOk={handleCancel}
        buttonSize="extra"
        okButtonCaption={'Quit'}
        fullWidthBtn
        icon={<AlertTriagle />}
        header={'Unopened Test'}
      >
        <p className="mt-5 text-center text-[#A1A1A1]">
          This test will be opened at{' '}
          <span className="font-bold text-primary">
            {dayjs(start_time).format('DD/MM/YYYY HH:mm:ss')}
          </span>
        </p>
      </SappModalV3>
    )
  }
}

export default TestAnnouncementModal
