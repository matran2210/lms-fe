import useCountdown from '@components/auth/Countdown'
import ButtonText from '@components/base/button/ButtonText'
import SappButton from '@components/base/button/SappButton'
import SappModalV2 from '@components/base/modal/SappModalV2'
import SAPPTextFiled from '@components/base/textfield/SAPPTextFiled'
import React, {
  createRef,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { UseFormGetValues, UseFormReset } from 'react-hook-form'
import { AuthAPI } from 'src/pages/api/profile'
import { IChangePassword } from './ChangePassword'
import toast from 'react-hot-toast'

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  reset: UseFormReset<any>
  getValues: UseFormGetValues<IChangePassword>
}

const PasswordProfile = ({ open, reset, setOpen, getValues }: IProps) => {
  const [code, setCode] = useState(Array(6).join('.').split('.'))
  const [canResend, setCanResend] = useState(false)
  const [timeCountDown, setTimeCountDown, time] = useCountdown(5)
  const [timeCountDownResent, settimeCountDownResent] = useState<number>(285)
  const [errorMessage, setErrorMessage] = useState('')
  const inputRefs = Array(6)
    .fill(0)
    .map(() => createRef<HTMLInputElement>())

  const [loading, setLoading] = useState<boolean>(false)

  /**
   * @description mở popup set lại countdown và message error
   */
  useEffect(() => {
    if (open) {
      setTimeCountDown(5)
      setErrorMessage('')
    }
  }, [open])

  /**
   * @description Handle countdown timeout
   */
  useEffect(() => {
    if (time < timeCountDownResent && canResend === false) {
      setCanResend(true)
    }

    if (time <= 0) {
      setErrorMessage('OTP expired. Please generate a new OTP and try again!')
      setCanResend(true)
    }
  }, [timeCountDown])

  /**
   * @description Handling when entering code into the input cell
   */
  const onEnterDigit = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = event.target.value

    // Validate input data, pass if data is single number or empty string
    if ((Number.isNaN(parseInt(value)) && value != '') || value.length > 1)
      return event.preventDefault()

    // Focus to next input cell
    if (index < 5 && value) {
      inputRefs[index + 1].current?.focus()
    }

    // Update the code
    let newCode = [...code]
    newCode[index] = value
    setCode(newCode)
  }

  /**
   * @description chức năng paste OTP
   */
  const handlePaste = (index: number, e: any) => {
    e.preventDefault() // Ngăn chặn hành động paste mặc định
    const pasted = e.clipboardData
      .getData('text/plain')
      .replace(/\n/g, '')
      .replace(/\r/g, '')
      .split(' ')
      .slice(0, 6)

    // Update the OTP array
    const newOtp = [...code]
    newOtp.splice(index, pasted.length, ...pasted)
    setCode(newOtp?.filter((value) => value !== ''))
  }

  /**
   * @description function verify code
   */
  const verifyCode = async () => {
    setLoading(true)
    try {
      await AuthAPI.verifyOTPPassword(
        getValues('password'),
        getValues('newPassword'),
        code?.join(''),
      )
      reset()
      setOpen(false)
      setCode(['', '', '', '', '', ''])
      toast.success('Change Password Successfully!')
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  /**
   * @description Handle on click resend button
   */
  const onResendCode = async () => {
    try {
      await AuthAPI.changeUserPassword(getValues('password'))
      setErrorMessage('')
      setCanResend(false)
      settimeCountDownResent(() => {
        if (time <= 0) {
          setTimeCountDown(5)
          return 285
        }
        return time - 15
      })

      setCode(Array(6).join('.').split('.'))
    } catch (error) {}
  }

  return (
    <SappModalV2
      title={undefined}
      open={open}
      handleCancel={() => setOpen(false)}
      onOk={() => {}}
      showFooter={false}
    >
      <div className="">
        <div className="mb-2 text-4xl font-semibold text-bw-1">
          Change Password
        </div>
        <span className="mb-10 text-sm text-gray-1">
          Enter your 6-digit code that you received on your email.
        </span>
        <div className="mb-2 mt-12 grid grid-cols-6 grid-rows-1 gap-3">
          {code?.map((otp, index) => (
            <SAPPTextFiled
              key={index}
              inputRef={inputRefs[index]}
              type="text"
              value={otp}
              onChange={(event) => onEnterDigit(index, event)}
              inputClassName={`text-center h-[67px] w-[67px] ${
                errorMessage ? 'border-state-error' : 'border-gray-2'
              } pt-5.25 pb-5 px-0`}
              onPaste={(e: any) =>
                code?.every((data) => data === '') && handlePaste(index, e)
              }
            />
          ))}
        </div>
        <div className="mb-8 flex justify-between">
          <span className="text-sm text-state-error">{errorMessage}</span>
          <span
            className={`min-w-fit text-right text-sm ${
              timeCountDown === '00:00' ? 'text-state-error' : 'text-bw-1'
            }`}
          >
            {timeCountDown}
          </span>
        </div>
        <SappButton
          title="Verify Code"
          full={true}
          className="mb-5 h-12.5 !font-semibold"
          size="lager"
          loading={loading}
          onClick={verifyCode}
          disabled={code.some((e) => e === '') || time <= 0}
        />
        <ButtonText
          title="Resend Code"
          full={true}
          disabled={!canResend}
          onClick={onResendCode}
          className="pb-3.25 pt-3 no-underline"
          size="medium"
          loading={loading}
        />
      </div>
    </SappModalV2>
  )
}

export default PasswordProfile
