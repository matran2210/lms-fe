import useCountdown from '@components/auth/Countdown'
import ButtonText from '@components/v2/base/button/ButtonText'
import SappModalV2 from '@components/v2/base/modal/SappModalV2'
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
import ButtonPrimary from '@components/v2/base/button/ButtonPrimary'
import type { GetProps } from 'antd'
import { Input } from 'antd'

type OTPProps = GetProps<typeof Input.OTP>
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
      setErrorMessage('Invaild OTP. Please try again!')
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

  const otpLength = 6

  const onInput: OTPProps['onInput'] = (value) => {
    const paddedValue = Array.from(
      { length: otpLength },
      (_, i) => value[i] || '',
    )
    setCode(paddedValue)
  }

  const sharedProps: OTPProps = {
    onInput,
  }
  return (
    <SappModalV2
      title={''}
      open={open}
      handleCancel={() => setOpen(false)}
      onOk={() => {}}
      showFooter={false}
      classNameModal="sapp-profile-modal"
    >
      <div className="flex flex-col items-center justify-between gap-6 md:gap-10">
        <div className="text-primary">
          <Icon
            type="mail-box"
            className="h-12 w-12 md:!h-[88px] md:!w-[88px]"
          />
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-4 md:gap-8">
          <div className="text-center text-sm md:text-xl">
            <div>Please enter the code we sent to</div>
            <div>
              <span className="text-xl font-semibold">
                {user?.user_contacts?.[0]?.email || ''}
              </span>
            </div>
          </div>
          <div className="w-full">
            <div className="mb-2">
              <Input.OTP
                length={otpLength}
                {...sharedProps}
                size="large"
                rootClassName="profile-change-password"
                status={errorMessage ? 'error' : undefined}
                className="profile-change-password"
              />
            </div>
            <div className="flex justify-between">
              <span className="text-error-v2-400 text-sm">{errorMessage}</span>
              <span
                className={`min-w-fit text-right text-sm font-semibold ${
                  timeCountDown === '00 : 00'
                    ? 'text-error-v2-400'
                    : 'text-[#050505]'
                }`}
              >
                {timeCountDown}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full">
          <ButtonPrimary
            title="Verify Code"
            full={true}
            className="mb-4 rounded-lg py-2 font-semibold"
            size="medium"
            loading={loading}
            onClick={verifyCode}
            disabled={code.some((e) => e === '') || time <= 0}
          />
          <ButtonText
            title="Resend Code"
            full={true}
            disabled={!canResend}
            onClick={onResendCode}
            className="text-base font-medium"
            size="medium"
            loading={loading}
          />
        </div>
      </div>
    </SappModalV2>
  )
}

export default PasswordProfile
