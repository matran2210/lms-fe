import SappButton from '@components/base/button/SappButton'
import SearchForm from '@components/mycourses/Search'
import { useRouter } from 'next/router'
import React from 'react'
import { ANIMATION, PageLink } from 'src/constants'
import { useAppSelector } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'
import dashboard from 'src/assets/images/dashboard.png'
import Image from 'next/image'
import Layout from '@components/layout'
import { MY_COURSES } from 'src/constants/lang'

const Dashboard = () => {
  const router = useRouter()
  const { user } = useAppSelector(userReducer)

  return (
    <Layout title="Dashboard">
      <div className="border-b border-default bg-white px-4 lg:px-20">
        <div className="mx-auto my-0 flex max-w-xxl py-4.5">
          <SearchForm
            placeholder={MY_COURSES.placeholderSearch}
            formStyle="w-full flex items-center"
          />
        </div>
      </div>
      <div className="lg:px-20" data-aos={ANIMATION.DATA_AOS}>
        <div
          className="main mx-auto my-0 max-w-xxl px-4 pt-6 lg:px-0"
          data-aos={ANIMATION.DATA_AOS}
        >
          <h2 className="pb-4 text-medium-sm font-medium text-bw-1">
            Dashboard
          </h2>
        </div>
      </div>
      <div
        className="mx-auto min-h-[calc(100vh-9rem)] max-w-xxl bg-white shadow-activity"
        data-aos={ANIMATION.DATA_AOS}
      >
        <div className="boxShadow-activity relative flex min-h-[calc(100vh-9rem)] flex-col justify-center">
          <div className="flex flex-col">
            <div className="mb-2.5 flex justify-center">
              <div className="text-xl font-light text-gray-1">Hi,</div>
              <div className="ms-2 text-xl font-semibold text-bw-1">
                {user?.detail?.full_name}
              </div>
              <div className="text-xl font-light text-gray-1">. Welcome!</div>
            </div>
            <div className="flex justify-center text-xl font-light text-gray-1">
              We are launching this site very soon. Please come back later.
            </div>
            <div className="mt-10 flex justify-center">
              <SappButton
                title="Go to Your Course"
                size="medium"
                onClick={() => router.push(PageLink.COURSES)}
              />
            </div>
          </div>
          <div className="absolute bottom-0">
            <Image src={dashboard} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
