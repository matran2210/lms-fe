import ButtonPrimary from '@components/base/button/ButtonPrimary'
import ButtonText from '@components/base/button/ButtonText'
import SAPPTextFiled from '@components/base/textfield/SAPPTextFiled'
import { createRef, useEffect, useState } from 'react'
import useCountdown from './Countdown'

interface IInputCodeFormProps {
  error?: string
  // onVerify
}

const InputCodeForm = ({ error = '' }: IInputCodeFormProps) => {
  const [code, setCode] = useState(Array(6).join('.').split('.'))
  const [canResend, setCanResend] = useState(true)
  const [codeSent, setCodeSent] = useState(false)
  const [timeCountDown, setTimeCountDown] = useCountdown(0)
  const [errorMessage, setErrorMessage] = useState(error)
  const inputRefs = Array(6)
    .fill(0)
    .map(() => createRef<HTMLInputElement>())

  // Handle countdown timeout
  useEffect(() => {
    if (timeCountDown === '00:00' && codeSent) {
      setErrorMessage('OTP expired. Please generate a new OTP and try again!')
      setCanResend(true)
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
  const onResendCode = () => {
    !codeSent && setCodeSent(true)
    setErrorMessage('')
    setCanResend(false)
    setTimeCountDown(0, 5)
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
        className="pt-2.5 pb-3.25 mb-3"
      />
      <ButtonText
        title="Resend Code"
        full={true}
        disabled={!canResend}
        onClick={onResendCode}
        className="no-underline pt-2.5 pb-3.25"
      />
    </>
  )
}

export default InputCodeForm
