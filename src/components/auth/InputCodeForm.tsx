import ButtonPrimary from '@components/base/button/ButtonPrimary'
import ButtonText from '@components/base/button/ButtonText'
import SAPPTextFiled from '@components/base/textfield/SAPPTextFiled'
import { createRef, useEffect, useState } from 'react'
import useCountdown from './Countdown'
import AuthApi from 'src/redux/services/Authen'
import { setAccessToken } from '@utils/helpers/authen'
import { useRouter } from 'next/router'
import { PageLink } from 'src/constants'
import toast from 'react-hot-toast'

interface IInputCodeFormProps {
  error?: string
  email: string
  token: string
}

const InputCodeForm = ({ error = '', email, token }: IInputCodeFormProps) => {
  const router = useRouter()
  const [code, setCode] = useState(Array(6).join('.').split('.'))
  const [canResend, setCanResend] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [timeCountDown, setTimeCountDown, time] = useCountdown(30)
  const [errorMessage, setErrorMessage] = useState(error)
  const inputRefs = Array(6)
    .fill(0)
    .map(() => createRef<HTMLInputElement>())

  const [loading, setLoading] = useState<boolean>(false)

  const [currentToken, setCurrentToken] = useState(token)

  // Handle countdown timeout
  useEffect(() => {
    if (time < 1740 && canResend === false) {
      setCanResend(true)
    }

    if (timeCountDown === '00:00' && codeSent) {
      setErrorMessage('OTP expired. Please generate a new OTP and try again!')
    }
  }, [timeCountDown, codeSent])

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
      const response = await AuthApi.sendEmail({ email })
      if (!response.success) {
        setErrorMessage('Resend code failed. Please try again')
        return
      }
      !codeSent && setCodeSent(true)
      setErrorMessage('')
      setCanResend(false)
      setTimeCountDown(30)
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
      const response = await AuthApi.verifyOtp({
        code: code?.join(''),
        token: currentToken,
      })
      if (response.success && response.data.success) {
        setAccessToken(response.data.act)
        setTimeout(() => {
          router.push(PageLink.AUTH_CHANGE_PASSWORD)
        }, 1000)
      }
    } catch (error: any) {
      if (error.response.data.error.code === '400|2001') {
        toast.error('Invalid OTP')
      }
    } finally {
      setLoading(false)
    }
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
          />
        ))}
      </div>
      <div className="flex justify-between mb-8">
        <span className="text-medium-sm text-state-error">{errorMessage}</span>
        <span
          className={`min-w-fit text-right text-medium-sm ${
            timeCountDown === '00:00' && codeSent
              ? 'text-state-error'
              : 'text-bw-1'
          }`}
        >
          {timeCountDown}
        </span>
      </div>
      <ButtonPrimary
        title="Verify Code"
        full={true}
        className="mb-3"
        size="lager"
        loading={loading}
        onClick={handleVerifyCode}
        disabled={code.some((e) => e === '')}
      />
      <ButtonText
        title="Resend Code"
        full={true}
        disabled={!canResend}
        onClick={onResendCode}
        className="no-underline pt-2.5 pb-3.25"
        loading={loading}
      />
    </>
  )
}

export default InputCodeForm
