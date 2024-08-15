import Google_Logo from '@assets/images/google_logo.svg'
import Microsoft_Logo from '@assets/images/microsoft_logo.svg'
import SappButton from '@components/base/button/SappButton'
import HookFormCheckBox from '@components/base/checkbox/HookFormCheckBox'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LAYOUT } from '@utils/constants'
import {
  SHOW_ERROR_ACCOUNT_LOCK,
  SHOW_ERROR_USERNAME_PASSWORD,
  VALIDATE_LOGIN_EMAIL_REQUIRED,
  VALIDATE_MIN_LENGTH,
  VALIDATE_PASSWORD_REQUIRED,
  VALIDATE_REQUIRED,
} from '@utils/helpers/ValidateMessage'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { PageLink } from 'src/constants'
import { EntranceTestAPI } from 'src/pages/api/entrance-test'
import { clearGuideState } from 'src/redux/slice/Course/UserGuide'
import { getEntranceCount } from 'src/redux/slice/EntranceTest/EntranceTest'
import { getMessagingToken } from 'src/utils/firebase'
import { z } from 'zod'
import { useAppDispatch, useAppSelector } from '../../../redux/hook'
import { getLoginUser, loginReducer } from '../../../redux/slice/Login/Login'
import PopUpLimit from './PopupLimit'
import { getKeycloakInstance } from '../../../utils/helpers/keycloak'
import SingleDialogLayout from '@components/layout/SingleDialog'

interface IInputProps {
  login: string
  password: string
  remember_me: boolean
  device_id: string
}

// const SocialLogos = [
//   { url: Microsoft_Logo, alt: 'Microsoft Logo' },
//   { url: Google_Logo, alt: 'Google Logo' },
// ]

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
        message: VALIDATE_LOGIN_EMAIL_REQUIRED,
      })
      .min(5, { message: VALIDATE_MIN_LENGTH('Username or Email', 5) }),
    password: z.string({ required_error: VALIDATE_REQUIRED }).trim().min(1, {
      message: VALIDATE_PASSWORD_REQUIRED,
    }),
    // .min(8, { message: VALIDATE_MIN_LENGTH_PASSWORD('Password', 8, 1, 1) }),
    // .regex(VALIDATE_PASSWORD, VALIDATE_PASSWORD_REGEX_MSG),
    remember_me: z.boolean().default(false),
  })

  // Using validate for input
  const { control, setError, handleSubmit } = useForm<IInputProps>({
    resolver: zodResolver(validationSchema),
    mode: 'onSubmit',
    defaultValues: {
      login: '',
      password: '',
      remember_me: false,
      device_id: '',
    },
  })

  const handleDeviceToken = async (): Promise<string | undefined> => {
    try {
      const accessDeviceToken = await AsyncStorage.getItem(
        'firebaseDeviceToken',
      )
      if (accessDeviceToken) {
        return accessDeviceToken
      }
      if (window?.Notification?.permission !== 'denied') {
        const token = await getMessagingToken()
        if (token) {
          await AsyncStorage.setItem('firebaseDeviceToken', token)
        }
        return token ?? ''
      }
    } catch (error) {
      return ''
    }
  }

  async function getListEntranceTest() {
    try {
      const res = await EntranceTestAPI.getListEntranceTestLogin()
      const beforeLoginPath = localStorage.getItem('beforeLoginPath')
      if (res?.data?.length > 0) {
        router.push(PageLink.ENTRANCE_TEST)
      } else {
        router.push(beforeLoginPath || PageLink.COURSES)
      }
    } catch (error) {}
  }

  const incorrectEmailAndPassword = ['400|010433', '400|010833']
  // Call API when submit
  const onSubmit = async (data: IInputProps) => {
    const { login, password, remember_me } = data
    setLoading(true)
    try {
      const getFireBaseToken = await handleDeviceToken()
      dispatch(
        getLoginUser({
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
        .then(() => {
          const beforeLoginPath = localStorage.getItem('beforeLoginPath')
          if (beforeLoginPath) {
            router.push(beforeLoginPath)
          }
        })
        .catch((error) => {
          const codeError = error?.response?.data?.error?.code
          if (codeError === '403|000010') {
            setOpenLimit(true)
          } else if (
            incorrectEmailAndPassword.includes(
              error?.response?.data?.error?.code,
            )
          ) {
            setError('password', { message: SHOW_ERROR_USERNAME_PASSWORD })
          } else if (codeError === '400|010008') {
            setError('password', { message: SHOW_ERROR_ACCOUNT_LOCK })
          }

          setTimeout(() => {
            setLoading(false)
          }, 1000)
        })
    } catch (error: any) {}
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

  useEffect(() => {
    const keycloak = getKeycloakInstance()
    setLoading(true)
    const checkKeycloakAuthentication = async () => {
      if (keycloak.authenticated) {
        try {
          const getFireBaseToken = await handleDeviceToken()
          dispatch(
            getLoginUser({
              device_id: getFireBaseToken,
            }),
          )
            .unwrap()
            .then((payload) => {
              getListEntranceTest()
              dispatch(clearGuideState())
              dispatch(getEntranceCount())
              localStorage.setItem('enstranceTest', 'true')
            })
            .catch((error) => {
              if (error?.response?.data?.error?.code === '403|000010') {
                setOpenLimit(true)
              } else if (error?.response?.data?.error?.code === '401|0000') {
                setError('login', { message: SHOW_ERROR_USERNAME_PASSWORD })
                setError('password', { message: SHOW_ERROR_USERNAME_PASSWORD })
              }
              setTimeout(() => {
                setLoading(false)
              }, 1000)
            })
        } catch (error) {}
      } else {
        setLoading(false)
      }
    }
    checkKeycloakAuthentication()
  }, [router])

  return (
    <SingleDialogLayout title="Login">
      <div className="mx-auto block max-h-[515px] max-w-[38.375rem] px-8 py-8 xs:py-10 md:overflow-hidden md:px-19 md:py-17.5 md:shadow-single-dialog lg:overflow-hidden">
        <div className="mb-2 text-3xl font-semibold text-bw-1 md:text-4xl">
          Log In
        </div>
        <div className="mb-5 text-medium-sm text-gray-1 md:mb-10">
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
          <div className="mt-6 sm:mt-10">
            <SappButton
              title="Log In"
              full={true}
              className="mb-6 h-12.5 !font-semibold"
              size="lager"
              loading={loading ? loading : userLogin.loading}
              type="submit"
              disabled={loading}
            />
          </div>
          <div className="flex justify-between 2xl:mb-15">
            <HookFormCheckBox
              control={control}
              name="remember_me"
              className="h-4 min-h-4 min-w-4"
              title="Keep me logged in"
              classNameTitle="text-medium-sm text-gray-1"
              state="primary"
              inputStyle="border-[#DCDDDD]"
            />
            <span className="text-medium-sm text-gray-1 hover:underline">
              <Link href={PageLink.AUTH_FORGOT_PASSWORD}>
                Forgot Password ?
              </Link>
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
    </SingleDialogLayout>
  )
}

// eslint-disable-next-line import/no-unused-modules
export default LoginPage
LoginPage.layout = LAYOUT.SINGLE_DIALOG_LAYOUT
