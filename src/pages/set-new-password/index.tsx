import ButtonPrimary from '@components/base/button/ButtonPrimary'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { LAYOUT, VALIDATION_FILED } from '@utils/constants'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { GUIDELINE_PASSWORD, PageLink } from 'src/constants'
import { LANG_SIGNIN } from 'src/constants/lang'
import { z } from 'zod'

// import Link from 'next/link'

interface IInputProps {
  confirmPassword: string
  password: string
}

const SetNewPasswordPage = () => {
  const [loading, setLoading] = useState(false)
  // Validate for input
  const validationSchema = z.object({
    password: z
      .string({ required_error: VALIDATION_FILED })
      .min(8, { message: VALIDATION_FILED }),
    confirmPassword: z
      .string({ required_error: VALIDATION_FILED })
      .min(8, { message: VALIDATION_FILED }),
  })

  // Using validate for input
  const { control, handleSubmit } = useForm<IInputProps>({
    resolver: zodResolver(validationSchema),
    mode: 'onChange',
  })

  // Call API when submit
  const onSubmit = async (data: IInputProps) => {
    return data
  }

  const [passwordVisible, setPasswordVisible] = useState(true)
  const toggleChangeType = () => {
    setPasswordVisible(!passwordVisible)
  }

  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true)
  const toggleChangeTypeConfirmPassword = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible)
  }

  return (
    <div className="d-flex flex-column flex-root sapp-height-layout--login justify-content-center">
      <div className="d-flex flex-column  flex-lg-row justify-content-center">
        <div className="d-flex  flex-lg-row-auto justify-content-center justify-content-lg-end">
          <div className="bg-body d-flex flex-column align-items-stretch flex-center rounded-4 w-md-600px box-shadow--custom">
            <div className="d-flex flex-center flex-column  px-lg-10">
              {/* Start Form Login */}
              <form className="form w-100" onSubmit={handleSubmit(onSubmit)}>
                <div className="text-center mb-10">
                  <h1 className="text-bw-1 text-4xl mb-2 font-bold text-left">
                    New Password
                  </h1>
                  <div className="text-gray-500 text-medium-sm font-normal not-italic text-gray-1 text-left">
                    Set the new password for your account
                  </div>
                </div>

                {/* Start TextField Email */}
                <div className="fv-row mb-6">
                  <HookFormTextField
                    control={control}
                    name="password"
                    placeholder={LANG_SIGNIN.password}
                    type={passwordVisible ? 'password' : 'text'}
                    onChangeType={toggleChangeType}
                    passwordVisible={passwordVisible}
                    showIconPassword
                    guideline={GUIDELINE_PASSWORD}
                  />
                </div>
                {/* End TextField Email */}

                {/* Start TextField Password */}
                <div className="fv-row mb-6">
                  <HookFormTextField
                    control={control}
                    name="confirmPassword"
                    placeholder="Comfirm Password"
                    type={confirmPasswordVisible ? 'password' : 'text'}
                    onChangeType={toggleChangeTypeConfirmPassword}
                    passwordVisible={confirmPasswordVisible}
                    showIconPassword
                  />
                </div>
                {/* End TextField Password */}

                {/* Start Button Login */}
                <div className="d-grid pt-4 mb-8">
                  <ButtonPrimary
                    title="Submit"
                    loading={loading}
                    type="submit"
                    className="w-full h-12.5"
                  />
                </div>
                <div className="d-grid text-center">
                  <ButtonSecondary
                    className="bg-transparent hover:bg-transparent hover:underline"
                    link={PageLink.AUTH_LOGIN}
                    title="Cancel"
                  />
                </div>
                {/* End Button Login */}
              </form>
              {/* End Form Login */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// eslint-disable-next-line import/no-unused-modules
export default SetNewPasswordPage
SetNewPasswordPage.layout = LAYOUT.SINGLE_DIALOG_LAYOUT
