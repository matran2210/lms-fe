import useCountdown from '@components/auth/Countdown'
import ButtonText from '@components/base/button/ButtonText'
import SappModalV2 from '@components/base/modal/SappModalV2'
import SAPPTextFiled from '@components/base/textfield/SAPPTextFiled'
import Icon from '@components/icons'
import React, {
  createRef,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { UseFormGetValues, UseFormReset } from 'react-hook-form'
import toast from 'react-hot-toast'
import { AuthAPI } from 'src/pages/api/profile'
import { useAppSelector } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'
import { IChangePassword } from './ChangePassword'

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  reset: UseFormReset<any>
  getValues: UseFormGetValues<IChangePassword>
}

const PasswordProfile = ({ open, reset, setOpen, getValues }: IProps) => {
  const { user } = useAppSelector(userReducer)

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
      classNameModal="sapp-profile-modal"
    >
      <div className="flex flex-col items-center justify-between gap-10">
        <div className="text-primary">
          <Icon type="mail-box" />
        </div>
        <div className="flex flex-col items-center justify-between gap-8">
          <div className="text-center text-xl">
            <div>Please enter the code we sent to</div>
            <div>
              <span className="font-semibold">
                {user?.user_contacts?.[0]?.email || ''}
              </span>
            </div>
          </div>
          <div>
            <div className="mb-2 grid grid-cols-6 grid-rows-1 gap-3">
              {code?.map((otp, index) => (
                <SAPPTextFiled
                  key={index}
                  inputRef={inputRefs[index]}
                  type="text"
                  value={otp}
                  onChange={(event) => onEnterDigit(index, event)}
                  inputClassName={`text-center h-[67px] w-[67px] rounded-md ${
                    errorMessage ? 'border-[#B90E0A]' : 'border-[#DCDDDD]'
                  } pt-5.25 pb-5 px-0`}
                  onPaste={(e: any) =>
                    code?.every((data) => data === '') && handlePaste(index, e)
                  }
                />
              ))}
            </div>
            <div className="flex justify-between">
              <span className="text-medium-sm text-error">
                {errorMessage}
              </span>
              <span
                className={`text-medium-sm min-w-fit text-right ${
                  timeCountDown === '00:00' ? 'text-error' : 'text-[#050505]'
                }`}
              >
                {timeCountDown}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full">
          <ButtonText
            title="Verify Code"
            full={true}
            className="mb-2 rounded-md bg-[#29353C] px-6 py-3 text-base font-semibold text-white no-underline hover:bg-black"
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
            className="text-sm font-semibold"
            size="medium"
            loading={loading}
          />
        </div>
      </div>
    </SappModalV2>
  )
}

export default PasswordProfile
