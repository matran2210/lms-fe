import ButtonText from '@components/base/button/ButtonText'
import SappButton from '@components/base/button/SappButton'
import SAPPTextFiled from '@components/base/textfield/SAPPTextFiled'
import { setActToken } from '@utils/index'
import { useRouter } from 'next/router'
import { createRef, useEffect, useState } from 'react'
import { PageLink } from 'src/constants'
import useCountdown from './Countdown'
import { AuthAPI } from '../../pages/api/profile/index'

interface IInputCodeFormProps {
  error?: string
  email: string
  token: string
}

const InputCodeForm = ({ error = '', email, token }: IInputCodeFormProps) => {
  const router = useRouter()
  const [code, setCode] = useState(Array(6).join('.').split('.'))
  const [canResend, setCanResend] = useState(false)
  const [timeCountDown, setTimeCountDown, time] = useCountdown(5)
  const [timeCountDownResent, settimeCountDownResent] = useState<number>(285)
  const [errorMessage, setErrorMessage] = useState(error)
  const inputRefs = Array(6)
    .fill(0)
    .map(() => createRef<HTMLInputElement>())

  const [loading, setLoading] = useState<boolean>(false)

  const [currentToken, setCurrentToken] = useState(token)

  // Handle countdown timeout
  useEffect(() => {
    if (time < timeCountDownResent && canResend === false) {
      setCanResend(true)
    }

    if (time <= 0) {
      setErrorMessage('OTP expired. Please generate a new OTP and try again!')
      setCanResend(true)
    }
  }, [timeCountDown])

  // Handling when entering code into the input cell
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

  // Handle on click resend button
  const onResendCode = async () => {
    setLoading(true)
    try {
      const response = await AuthAPI.sendEmail({ email })
      if (!response.success) {
        setErrorMessage('Resend code failed. Please try again')
        return
      }

      setErrorMessage('')
      setCanResend(false)
      settimeCountDownResent(() => {
        if (time <= 0) {
          setTimeCountDown(5)
          return 285
        }
        return time - 15
      })
      setCurrentToken(response.data.token)

      setCode(Array(6).join('.').split('.'))
    } catch (error) {
      setErrorMessage('Resend code failed. Please try again')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    try {
      setLoading(true)
      const response = await AuthAPI.verifyOtp({
        code: code?.join(''),
        token: currentToken,
      })
      if (response.success && response.data.success) {
        setActToken(response.data.act)
        setTimeout(() => {
          router.push(PageLink.AUTH_CHANGE_PASSWORD)
        }, 1000)
      }
      setTimeCountDown(5)
    } catch (error: any) {
      if (error.response.data.error.code === '400|2001') {
        setErrorMessage('Invalid OTP. Please try again!')
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePaste = (index: number, e: any) => {
    e.preventDefault() // Ngăn chặn hành động paste mặc định
    // const pasted = e.clipboardData.getData('text/plain').split(' ').slice(0, 6)

    // // Update the OTP array
    // const newOtp = [...code]
    // newOtp.splice(index, pasted.length, ...pasted)
    // setCode(newOtp)
  }

  return (
    <>
      <div className="grid grid-cols-6 grid-rows-1 gap-3 mb-2">
        {code.map((code, index) => (
          <SAPPTextFiled
            key={index}
            inputRef={inputRefs[index]}
            type="text"
            value={code}
            onChange={(event) => onEnterDigit(index, event)}
            inputClassName={`text-center h-16.75 w-16.75 ${
              errorMessage ? 'border-state-error' : 'border-gray-2'
            } pt-5.25 pb-5 px-0`}
            onPaste={(e: any) => handlePaste(index, e)}
          />
        ))}
      </div>
      <div className="flex justify-between mb-8">
        <span className="text-medium-sm text-state-error">{errorMessage}</span>
        <span
          className={`min-w-fit text-right text-medium-sm ${
            timeCountDown === '00:00' ? 'text-state-error' : 'text-bw-1'
          }`}
        >
          {timeCountDown}
        </span>
      </div>
      <SappButton
        title="Verify Code"
        full={true}
        className="mb-5 !font-semibold"
        size="lager"
        loading={loading}
        onClick={handleVerifyCode}
        disabled={code.some((e) => e === '') || time <= 0}
      />
      <ButtonText
        title="Resend Code"
        full={true}
        disabled={!canResend}
        onClick={onResendCode}
        className="no-underline pt-3 pb-3.25"
        size="medium"
        loading={loading}
      />
    </>
  )
}

export default InputCodeForm
