import Google_Logo from '@assets/images/google_logo.svg'
import Microsoft_Logo from '@assets/images/microsoft_logo.svg'
import HookFormCheckBox from '@components/base/checkbox/HookFormCheckBox'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { LAYOUT } from '@utils/constants'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import SappButton from '@components/base/button/SappButton'
import { VALIDATE_PASSWORD } from '@utils/constants/ValidateRegex'
import {
  VALIDATE_MIN_LENGTH,
  VALIDATE_PASSWORD_REGEX_MSG,
  VALIDATE_REQUIRED,
  VALIDATE_MIN_LENGTH_PASSWORD,
  SHOW_ERROR_USERNAME_PASSWORD,
} from '@utils/helpers/ValidateMessage'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { PageLink } from 'src/constants'
import { z } from 'zod'
import { useAppDispatch, useAppSelector } from '../../../redux/hook'
import { getLoginUser, loginReducer } from '../../../redux/slice/Login/Login'
import { getMessagingToken } from 'src/utils/firebase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PopUpLimit from './PopupLimit'
import { getEntranceCount } from 'src/redux/slice/EntranceTest/EntranceTest'
import EntranceApi from 'src/redux/services/EntranceTest'
import { clearGuideState } from 'src/redux/slice/Course/UserGuide'

interface IInputProps {
  login: string
  password: string
  remember_me: boolean
  device_id: string
}

const SocialLogos = [
  { url: Microsoft_Logo, alt: 'Microsoft Logo' },
  { url: Google_Logo, alt: 'Google Logo' },
]

const LoginPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const userLogin = useAppSelector(loginReducer)
  const [loading, setLoading] = useState<boolean>(false)
  const [openLimit, setOpenLimit] = useState<boolean>(false)
  // Validate for input
  const validationSchema = z.object({
    login: z
      .string({ required_error: VALIDATE_REQUIRED })
      .trim()
      .min(1, {
        message: VALIDATE_REQUIRED,
      })
      .min(5, { message: VALIDATE_MIN_LENGTH('Username or Email', 5) }),
    password: z
      .string({ required_error: VALIDATE_REQUIRED })
      .trim()
      .min(1, {
        message: VALIDATE_REQUIRED,
      })
      .min(8, { message: VALIDATE_MIN_LENGTH_PASSWORD('Password', 8, 1, 1) })
      .regex(VALIDATE_PASSWORD, VALIDATE_PASSWORD_REGEX_MSG),
    remember_me: z.boolean().default(false),
  })

  // Using validate for input
  const { control, setError, getValues, handleSubmit } = useForm<IInputProps>({
    resolver: zodResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      login: '',
      password: '',
      remember_me: false,
      device_id: '',
    },
  })

  const handleDeviceToken = async () => {
    try {
      const accessDeviceToken = await AsyncStorage.getItem(
        'firebaseDeviceToken',
      )
      if (accessDeviceToken) {
        return accessDeviceToken
      }
      const token = await getMessagingToken()
      if (token) {
        await AsyncStorage.setItem('firebaseDeviceToken', token)
      }
      return token
    } catch (error) {
      return ''
    }
  }

  async function getListEntranceTest() {
    try {
      const res = await EntranceApi.getListEntranceTestLogin()
      if (res?.data?.length > 0) {
        router.push(PageLink.ENTRANCE_TEST)
      } else {
        router.push(PageLink.COURSES)
      }
    } catch (error) {}
  }

  // Call API when submit
  const onSubmit = async (data: IInputProps) => {
    const { login, password, remember_me } = data
    setLoading(true)
    try {
      const getFireBaseToken = await handleDeviceToken()
      dispatch(
        getLoginUser({
          login,
          password,
          remember_me: remember_me ? remember_me : false,
          device_id: getFireBaseToken,
        }),
      )
        // dispatch(getEntranceCount())
        .unwrap()
        .then((payload) => {
          getListEntranceTest()
          dispatch(clearGuideState())
          dispatch(getEntranceCount())
          localStorage.setItem('enstranceTest', 'true')
        })
        .catch((error) => {
          if (error?.response?.data?.error?.code === '403|0001') {
            setOpenLimit(true)
          } else if (error?.response?.data?.error?.code === '401|0000') {
            setError('login', { message: SHOW_ERROR_USERNAME_PASSWORD })
            setError('password', { message: SHOW_ERROR_USERNAME_PASSWORD })
          }
          setTimeout(() => {
            setLoading(false)
          }, 1000)
        })
    } catch (error: any) {}
  }
  const socialLogin = () => {
    toast.error('Chức năng này sẽ được update vào version sau!')
  }

  useEffect(() => {
    async function registerFirebase() {
      const accessDeviceToken = await AsyncStorage.getItem(
        'firebaseDeviceToken',
      )
      if (!accessDeviceToken) {
        handleDeviceToken()
      }
    }
    registerFirebase()
  }, [])

  return (
    <>
      <div className="block max-w-[38.375rem] py-17.5 px-19 mx-auto shadow-single-dialog max-h-[515px] lg:overflow-hidden md:overflow-hidden">
        <div className="text-4xl font-bold text-bw-1 mb-2">Log In</div>
        <div className="text-medium-sm text-gray-1 mb-10">
          Login to Continue Learning
        </div>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="on">
          <HookFormTextField
            name="login"
            control={control}
            placeholder="Username or Email"
            type="text"
            textSize="sm"
          />
          <HookFormTextField
            name="password"
            control={control}
            placeholder="Password"
            type="password"
            textSize="sm"
            className="mt-6"
          />
          <div className="mt-10">
            <SappButton
              title="Log In"
              full={true}
              className="mb-6"
              size="lager"
              loading={loading ? loading : userLogin.loading}
              type="submit"
              disabled={loading}
            />
          </div>
          <div className="flex justify-between mb-15">
            <HookFormCheckBox
              control={control}
              name="remember_me"
              className="min-w-4 min-h-4 h-4"
              title="Keep me logged in"
              classNameTitle="text-medium-sm text-gray-1"
              state="primary"
            />
            <span className="text-medium-sm text-gray-1 hover:underline">
              <Link href={PageLink.AUTH_FORGOT_PASSWORD}>Forgot Password</Link>
            </span>
          </div>
          {/* <div className="flex justify-between items-center">
            <div className="flex gap-3 h-12.5">
              {SocialLogos.map((img, i) => (
                <a key={i} onClick={socialLogin}>
                  <Image src={img.url} alt={img.alt} width={50} height={50} />
                </a>
              ))}
            </div>
            <p className="text-medium-sm text-gray-1">
              Don&#39;t have an account?{' '}
              <a className="text-medium-sm text-state-info hover:underline">
                Register
              </a>
            </p>
          </div> */}
        </form>
      </div>
      <PopUpLimit open={openLimit} setOpen={setOpenLimit} />
    </>
  )
}

// eslint-disable-next-line import/no-unused-modules
export default LoginPage
LoginPage.layout = LAYOUT.SINGLE_DIALOG_LAYOUT
