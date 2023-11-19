import blankAvatar from '@assets/images/blank_avatar.webp'
import ButtonPrimary from '@components/base/button/ButtonPrimary'
import TextSkeleton from '@components/base/skeleton/TextSkeleton'
import Image from 'next/image'
import { useAppSelector } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'

const ProfileHeader = () => {
  const { user, loading, loadingEditName } = useAppSelector(userReducer)

  const srcset = `${user.detail.avatar['40x40']} 40w, ${user.detail.avatar['50x50']} 50w, ${user.detail.avatar['150x150']} 150w, ${user.detail.avatar['160x160']} 160w`
  return (
    <div className="block pr-8.25 py-10 pl-10 shadow-none bg-white mb-6">
      <div className="lg:flex block justify-start items-center gap-7.5">
        <div className="w-30 pt-29.2 rounded-full border-2 w border-primary relative shrink mb-6 lg:mb-0 ">
          <div
            className={`${
              loading ? 'animate-pulse' : ''
            } w-100 h-100 rounded-full m-1 absolute top-0 left-0 right-0 bottom-0 overflow-hidden`}
          >
            <>
              {user.detail.avatar['ORIGIN'] && (
                <img
                  src={user.detail.avatar['ORIGIN']}
                  srcSet={srcset}
                  sizes="(max-width: 600px) 40px, (max-width: 900px) 150px, 160px"
                  alt="avatar"
                  className="w-full h-full"
                />
              )}
            </>
            <Image
              src={blankAvatar}
              alt="avatar"
              className="w-full h-full absolute top-0 left-0 right-0 bottom-0"
            />
            ,
          </div>
        </div>
        <div className="flex-1 mb-6 lg:mb-0">
          <div className="font-bold text-2xl mb-4 truncate max-w-[600px] ">
            <TextSkeleton
              loading={loading || loadingEditName}
              height="6"
              width="[300px]"
            >
              {user.detail.full_name}
            </TextSkeleton>
          </div>
          <div className="md:flex block justify-start items-center gap-8 text-gray-1">
            <div className="flex justify-start items-center gap-1 mb-3 md:mb-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z"
                  stroke="#A1A1A1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z"
                  stroke="#A1A1A1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              35 Enrolled Courses
            </div>

            <div className="flex justify-start items-center gap-1">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
                  stroke="#A1A1A1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.21 13.8909L7 23.0009L12 20.0009L17 23.0009L15.79 13.8809"
                  stroke="#A1A1A1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              25 Certificates
            </div>
          </div>
        </div>

        <div>
          <ButtonPrimary
            size="lager"
            title={'Enroll New Course'}
          ></ButtonPrimary>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
