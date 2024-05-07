import SappButton from '@components/base/button/SappButton'
import SearchForm from '@components/mycourses/Search'
import { useRouter } from 'next/router'
import React from 'react'
import { ANIMATION, PageLink } from 'src/constants'
import { useAppSelector } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'
import dashboard from 'src/assets/images/dashboard.png'
import Image from 'next/image'

const Dashboard = () => {
  const router = useRouter()
  const { user } = useAppSelector(userReducer)

  return (
    <React.Fragment>
      <div className="header bg-white border-b border-default px-4 lg:px-20">
        <div className="max-w-xxl my-0 mx-auto flex py-4.5">
          <SearchForm
            placeholder="Enter name of course..."
            formStyle="w-full flex items-center"
          />
        </div>
      </div>
      <div className="lg:px-20" data-aos={ANIMATION.DATA_AOS}>
        <div
          className="main max-w-xxl my-0 mx-auto pt-6 px-4 lg:px-0"
          data-aos={ANIMATION.DATA_AOS}
        >
          <h2 className="text-medium-sm font-medium text-bw-1 pb-4">
            Dashboard
          </h2>
        </div>
      </div>
      <div
        className="bg-white max-w-xxl mx-auto sapp-dashboard shadow-activity"
        data-aos={ANIMATION.DATA_AOS}
      >
        <div className="sapp-dashboard justify-center flex flex-col relative boxShadow-activity">
          <div className="flex flex-col">
            <div className="flex justify-center mb-2.5">
              <div className="text-gray-1 font-normal text-xl">Hi,</div>
              <div className="font-semibold text-bw-1 ms-2 text-xl">
                {user?.detail?.full_name}
              </div>
              <div className="text-gray-1 font-normal text-xl">. Welcome!</div>
            </div>
            <div className="flex justify-center text-gray-1 text-xl">
              We are launching this site very soon. Please come back later.
            </div>
            <div className="mt-10 flex justify-center">
              <SappButton
                title="Go to Your Course"
                size="lager"
                onClick={() => router.push(PageLink.COURSES)}
              />
            </div>
          </div>
          <div className="absolute bottom-0">
            <Image src={dashboard} />
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Dashboard
