import useCountdown from '@components/auth/Countdown'
import ButtonText from '@components/base/button/ButtonText'
import SappButton from '@components/base/button/SappButton'
import SappModalV2 from '@components/base/modal/SappModalV2'
import SAPPTextFiled from '@components/base/textfield/SAPPTextFiled'
import React, { createRef, Dispatch, SetStateAction, useEffect, useState } from 'react'
import { UseFormGetValues, UseFormReset } from 'react-hook-form'
import { AuthAPI } from 'src/pages/api/profile'
import { IChangePassword } from './ChangePassword'
import toast from 'react-hot-toast'

interface IProps {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    reset: UseFormReset<any>
    setEditPassword: Dispatch<SetStateAction<boolean>>
    getValues: UseFormGetValues<IChangePassword>
}

const PasswordProfile = ({ open, reset, setOpen, setEditPassword, getValues }: IProps) => {
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
        const pasted = e.clipboardData.getData('text/plain').split(' ').slice(0, 6)

        // Update the OTP array
        const newOtp = [...code]
        newOtp.splice(index, pasted.length, ...pasted)
        setCode(newOtp)
    }

    /**
    * @description function verify code
    */
    const verifyCode = async () => {
        setLoading(true)
        try {
            await AuthAPI.verifyOTPPassword(getValues('password'), getValues('newPassword'), code?.join(''))
            reset()
            setOpen(false)
            setEditPassword(false)
            setCode(['', '', '', '', '', ''])
            toast.success('Change Password Successfully!')
        } catch (error) { }
        finally {
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
        } catch (error) { }
    }

    return (
        <SappModalV2 title={undefined} open={open} handleCancel={() => setOpen(false)} onOk={() => { }} showFooter={false}>
            <div className="">
                <div className="font-semibold text-bw-1 mb-2 text-4xl">
                    Change Password
                </div>
                <span className="text-medium-sm text-gray-1 mb-10">
                    Enter your 6-digit code that you received on your email.
                </span>
                <div className="grid grid-cols-6 grid-rows-1 gap-3 mb-2 mt-12">
                    {code.map((code, index) => (
                        <SAPPTextFiled
                            key={index}
                            inputRef={inputRefs[index]}
                            type="text"
                            value={code}
                            onChange={(event) => onEnterDigit(index, event)}
                            inputClassName={`text-center h-[67px] w-[67px] ${errorMessage ? 'border-state-error' : 'border-gray-2'
                                } pt-5.25 pb-5 px-0`}
                            onPaste={(e: any) => handlePaste(index, e)}
                        />
                    ))}
                </div>
                <div className="flex justify-between mb-8">
                    <span className="text-medium-sm text-state-error">{errorMessage}</span>
                    <span className={`min-w-fit text-right text-medium-sm ${timeCountDown === '00:00' ? 'text-state-error' : 'text-bw-1'}`}>
                        {timeCountDown}
                    </span>
                </div>
                <SappButton
                    title="Verify Code"
                    full={true}
                    className="mb-5 !font-semibold"
                    size="lager"
                    loading={loading}
                    onClick={verifyCode}
                    disabled={code.some((e) => e === '') || time <= 0}
                    classNameLoading='h-[50px]'
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
            </div>
        </SappModalV2>
    )
}

export default PasswordProfile