import Filter from '@components/mycourses/Filter'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { apiURL } from 'src/redux/services/httpService'
import CoursesList from '@components/mycourses/CoursesList'
import PopupWelcome from '@components/user-guide/PopupWelcome'
import PopupStep from '@components/user-guide/PopupStep'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { active, increment, reset } from 'src/redux/slice/Course/UserGuide'
import { UserGuide } from 'src/constants'
import { useRouter } from 'next/router'
import {
  buildQueryString,
  setCookieActToken,
  setCookieRefreshToken,
} from '@utils/index'
import { ICourseAll } from 'src/type/courses'
import CourseAPI from '../api/courses'
import {
  entranceTestReducer,
  getEntranceCount,
} from 'src/redux/slice/EntranceTest/EntranceTest'
import PopUpRemindEntrance from '@components/popUpRemindEntrance'
import { removeJwtToken } from '@utils/helpers/authen'

const DEFAULT_PAGESIZE = 9

const fetchData = async (
  page: number,
  pageSize: number,
  token: string,
  queryString?: string,
) => {
  const apiResponse = await axios.get(
    `${apiURL}/courses?page_index=${page}&page_size=${pageSize}${queryString}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return apiResponse?.data?.data
}

const MyCourse = ({ courses }: { courses: ICourseAll }) => {
  const dispatch = useAppDispatch()
  const guideStatus = useAppSelector((state) => state.userGuideReducer?.status)
  const guideStep = useAppSelector((state) => state.userGuideReducer?.step)
  const { shouldShowRemind } = useAppSelector(entranceTestReducer)
  const router = useRouter()

  const confirmDialogOverLayRef = useRef<HTMLDivElement>(null)

  const nextStep = () => {
    dispatch(increment())
  }

  const closeUserGuide = () => {
    if (confirmDialogOverLayRef.current) {
      confirmDialogOverLayRef.current.classList.add('animate-fade-out-overlay')
      confirmDialogOverLayRef.current.classList.add('pointer-events-none')
    }
    setTimeout(() => {
      dispatch(reset())
    }, 50)
  }

  useEffect(() => {
    AsyncStorage.getItem('userGuide').then((accessToken) => {
      if (!accessToken) {
        AsyncStorage.setItem('userGuide', 'actived')
        dispatch(active())
      }
    })
  }, [])
  useEffect(() => {
    dispatch(getEntranceCount())
  }, [])
  const [data, setData] = useState<ICourseAll>(courses || [])
  const [page, setPage] = useState(DEFAULT_PAGESIZE)
  const [loading, setLoading] = useState(false)
  const queryString = buildQueryString({
    name: router.query.name || '',
    status: router.query.status || '',
    type: router.query.type || '',
  })

  const loadMore = async () => {
    if (loading) return
    setLoading(true)
    try {
      const newData = await CourseAPI.getCourse(
        page + DEFAULT_PAGESIZE,
        queryString,
      )
      setData(newData?.data)
      setPage(page + DEFAULT_PAGESIZE)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        loadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, router.query.name, router.query.type, router.query.status])

  useEffect(() => {
    // Update data when courses?.data?.course_sections_with_progress changes
    setData(courses || [])
  }, [courses])

  return (
    <>
      <div className="header bg-white border-b border-default">
        <div
          className={`max-w-xxl my-0 mx-auto flex py-[18px] xl-max:mx-6 relative 
          ${guideStatus && guideStep === 1 ? 'bg-white z-50 px-5' : ''}`}
        >
          <SearchForm
            placeholder="Enter name of course..."
            formStyle="w-full flex items-center"
          />
          {guideStatus && guideStep === 1 && (
            <PopupStep
              content={UserGuide.CONTENT_STEP_1}
              className="top-full w-full max-w-[365px] left-0 mt-3"
              index={1}
              total={6}
              handleNext={nextStep}
              handleCancel={closeUserGuide}
            />
          )}
        </div>
      </div>
      <div className="main max-w-xxl my-0 mx-auto">
        <div className="flex justify-between xl-max:mx-6">
          <h2 className="text-medium-sm font-semibold text-bw-1 py-6">
            My Course
          </h2>
          <div
            className={`py-6 relative ${
              guideStatus && guideStep === 6 ? 'bg-white z-50 px-4 -mr-4' : ''
            }`}
          >
            <Filter courses={data} />
            {guideStatus && guideStep === 6 && (
              <PopupStep
                content={UserGuide.CONTENT_STEP_6}
                className="w-screen max-w-365px top-full right-full mt-3"
                index={6}
                total={6}
                handleNext={closeUserGuide}
                showCancel={false}
                titleButtonNext="Done"
              />
            )}
          </div>
        </div>
      </div>
      <div
        className={`heading bg-white max-w-xxl my-0 mx-auto flex relative xl-max:mx-6
        ${guideStatus && guideStep === 4 ? 'z-50' : ''}
      `}
      >
        <Heading
          greeting="Welcome to"
          title="My Course"
          des="The course is your starting point to learning. From here, you can access every topic, reading, and video lesson, as well as assignment questions."
        />
        {guideStatus && guideStep === 4 && (
          <PopupStep
            content={UserGuide.CONTENT_STEP_4}
            className="top-full w-full max-w-365px left-0 mt-3"
            index={4}
            total={6}
            handleNext={nextStep}
            handleCancel={closeUserGuide}
          />
        )}
      </div>
      <div
        className={`pt-6 max-w-xxl my-0 mx-auto relative
        ${guideStatus && guideStep === 5 ? 'sapp-active-item-guide' : ''}
      `}
      >
        {guideStatus && guideStep === 5 && (
          <PopupStep
            content={UserGuide.CONTENT_STEP_5}
            className="w-full max-w-xs 2xl:max-w-[362px] top-0 left-1/2 2xl:left-[33%] mt-6"
            index={5}
            total={6}
            handleNext={nextStep}
            handleCancel={closeUserGuide}
          />
        )}
        <CoursesList courses={data} setData={setData} setLoading={setLoading} />
      </div>
      {guideStatus && guideStep == 0 && <PopupWelcome />}
      {guideStatus && (
        <div
          ref={confirmDialogOverLayRef}
          className={`fixed animate-fade-in-overlay inset-0 bg-black opacity-55 transition-opacity z-40`}
        ></div>
      )}
      <PopUpRemindEntrance />
    </>
  )
}

export default MyCourse

export async function getServerSideProps(context: any) {
  const { req, res, query } = context
  const accessToken = req.cookies.accessToken
  const queryString = buildQueryString({
    name: query.name || '',
    status: query.status || '',
    type: query.type || '',
  })
  try {
    const courses = await fetchData(
      1,
      DEFAULT_PAGESIZE,
      accessToken,
      queryString,
    )

    return {
      props: {
        courses: courses,
      },
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      const refreshToken = req.cookies.refreshToken

      try {
        const refreshResponse = await axios.post(
          `${apiURL}/auth/rotate`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        )
        const userInfo = res?.data?.tokens
        const act = userInfo?.act
        const rft = userInfo?.rft
        // Save the new access token to the AsyncStorage
        await AsyncStorage.setItem('accessToken', act)
        await AsyncStorage.setItem('refreshToken', rft)
        setCookieActToken(act)
        setCookieRefreshToken(rft)
        res.setHeader('Set-Cookie', `accessToken=${act}; HttpOnly`)

        const courses = await fetchData(1, DEFAULT_PAGESIZE, act, queryString)

        return {
          props: {
            courses: courses,
          },
        }
      } catch (refreshError) {
        removeJwtToken()
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }
    }

    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}
