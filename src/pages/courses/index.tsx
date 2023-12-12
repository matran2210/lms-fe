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

const MyCourse = ({ courses }: any) => {
  const dispatch = useAppDispatch()
  const guideStatus = useAppSelector((state) => state.userGuideReducer?.status)
  const guideStep = useAppSelector((state) => state.userGuideReducer?.step)

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

  return (
    <>
      <div className="header bg-white border-b border-default">
        <div
          className={`max-w-xxl my-0 mx-auto flex py-[18px] px-5 relative 
          ${guideStatus && guideStep === 1 ? 'bg-white z-50' : ''}`}
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
        <div className="flex justify-between">
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
        className={`heading bg-white max-w-xxl my-0 mx-auto flex relative
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
    const apiResponse = await axios.get(
      `${apiURL}/courses?page_index=1&page_size=100&name=${
        query.name ?? ''
      }&type=${query.type ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    const courses = apiResponse.data?.data

    return {
      props: {
        courses,
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

        const newApiResponse = await axios.get(
          `${apiURL}/courses?page_index=1&page_size=10&name=${
            query.name ?? ''
          }&type=${query.type ?? ''}`,
          {
            headers: {
              Authorization: `Bearer ${refreshResponse.data.accessToken}`,
            },
          },
        )

        return {
          props: {
            courses: newApiResponse.data?.data,
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
