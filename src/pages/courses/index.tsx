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
import CourseAPI from '../api/courses'
import { useRouter } from 'next/router'

const DEFAULT_PAGESIZE = 9

const fetchData = async (
  page: number,
  pageSize: number,
  token: string,
  name?: string,
  type?: string,
  status?: string,
) => {
  const apiResponse = await axios.get(
    `${apiURL}/courses?page_index=${page}&page_size=${pageSize}&name=${
      name ?? ''
    }&type=${type ?? ''}&status=${status ?? ''}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return apiResponse?.data?.data
}

const MyCourse = ({ courses }: any) => {
  const dispatch = useAppDispatch()
  const guideStatus = useAppSelector((state) => state.userGuideReducer?.status)
  const guideStep = useAppSelector((state) => state.userGuideReducer?.step)
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

  const [data, setData] = useState<any>(courses || [])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const loadMore = async () => {
    if (loading) return
    setLoading(true)
    try {
      const newData = await CourseAPI.getCourse(
        page + 1,
        DEFAULT_PAGESIZE,
        router.query.name,
        router.query.type,
      ) // Increase pageSize by 3
      setData([...data, ...newData?.data?.data?.course_sections_with_progress])
      setPage(page + 1)
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
  }, [loading, page])

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
              className="top-full w-full left-0 mt-3"
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
            className={`py-6 relative
            ${guideStatus && guideStep === 6 ? 'bg-white z-50 px-4 -mr-4' : ''}
          `}
          >
            <Filter courses={courses} />
            {guideStatus && guideStep === 6 && (
              <PopupStep
                content={UserGuide.CONTENT_STEP_6}
                className="w-screen top-full right-full mt-3"
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
            className="top-full w-full left-0 mt-3"
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
            className="w-full top-0 left-1/3 mt-6"
            index={5}
            total={6}
            handleNext={nextStep}
            handleCancel={closeUserGuide}
          />
        )}
        <CoursesList courses={courses} />
      </div>
      {guideStatus && guideStep == 0 && <PopupWelcome />}
      {guideStatus && (
        <div
          ref={confirmDialogOverLayRef}
          className={`fixed animate-fade-in-overlay inset-0 bg-black opacity-55 transition-opacity z-40`}
        ></div>
      )}
    </>
  )
}

export default MyCourse

export async function getServerSideProps(context: any) {
  const { req, res, query } = context
  const accessToken = req.cookies.accessToken

  try {
    const courses = await fetchData(
      1,
      DEFAULT_PAGESIZE,
      accessToken,
      query.name,
      query.type,
      query.status,
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

        res.setHeader(
          'Set-Cookie',
          `accessToken=${refreshResponse.data.accessToken}; HttpOnly`,
        )

        const courses = await fetchData(
          1,
          DEFAULT_PAGESIZE,
          accessToken,
          query.name,
          query.type,
          query.status,
        )

        return {
          props: {
            courses: courses,
          },
        }
      } catch (refreshError) {}
    } else {
    }

    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}
