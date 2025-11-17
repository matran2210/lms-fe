import Icon from '@components/icons'
import LayoutTeacher from '@components/layout/Teacher'
import TabHeaderItem from '@components/tab/TabHeaderItem'
import Certificate from '@components/teacher/my-profile/Certificate'
import ChangePassword from '@components/teacher/my-profile/ChangePassword'
import DeviceList from '@components/teacher/my-profile/DeviceInformation/DeviceList'
import LoginHistoryList from '@components/teacher/my-profile/LoginHistory/LoginHistoryList'
import MyProfile from '@components/teacher/my-profile/MyProfile'
import ProfileHeader from '@components/teacher/my-profile/ProfileHeader'
import MyPasword from '@components/teacher/my-profile/Security/MyPasword'
import Settings from '@components/teacher/my-profile/Settings'
import { RequestProvider } from '@contexts/RequestContext'
import { Tabs } from 'antd'
import { StaticImageData } from 'next/image'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import { PageLink } from '@lms/core'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import { ITabs } from '@lms/core'

const breadcrumbs: ITabs[] = [
  {
    link: PageLink.TEACHERS,
    title: 'LMS',
  },
  {
    link: PageLink.TEACHER_MY_PROFILE,
    title: 'My Profile',
  },
]
const tabs = [
  {
    id: 'overview',
    title: 'Overview',
  },
  {
    id: 'certificates',
    title: 'Certificates',
  },
  {
    id: 'sercurity',
    title: 'Security',
  },
  {
    id: 'setting',
    title: 'Setting',
  },
]
const MyProfilePage = () => {
  const router = useRouter()
  const { query } = router
  const inputFileRef = useRef<HTMLInputElement | null>(null)

  const selectedTab = query.tab
    ? (tabs.find((item) => item.id == query.tab)?.id ?? tabs[0].id)
    : tabs[0].id

  const [selected, setSelected] = useState<string>(selectedTab)
  const [avatar, setAvatar] = useState<File>()
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [isChangePassword, setIsChangePassword] = useState<boolean>(false)

  const [reViewImageSrc, setReViewImageSrc] = useState<
    string | StaticImageData
  >()

  const handleSetAvatar = (avatar: File | undefined) => {
    setAvatar(avatar)
  }
  const items = [
    {
      key: 'my-profile',
      label: (
        <TabHeaderItem icon={<Icon type="my-profile" />} title="My profile" />
      ),
      children: (
        <>
          <MyProfile
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            avatar={avatar}
            handleSetAvatar={handleSetAvatar}
            setReViewImageSrc={setReViewImageSrc}
          />
        </>
      ),
    },
    {
      key: 'certificates',
      label: (
        <TabHeaderItem
          icon={<Icon type="certificates" />}
          title="Certificates"
        />
      ),
      children: <Certificate />,
    },

    {
      key: 'sercurity',
      label: (
        <TabHeaderItem icon={<Icon type="sercurity" />} title="Sercurity" />
      ),
      children: (
        <>
          {isChangePassword ? (
            <ChangePassword handleCancel={() => setIsChangePassword(false)} />
          ) : (
            <div className="flex flex-col">
              <MyPasword setIsChangePassword={setIsChangePassword} />
              <DeviceList />
              <LoginHistoryList />
            </div>
          )}
        </>
      ),
    },
    {
      key: 'setting',
      label: <TabHeaderItem icon={<Icon type="setting" />} title="Setting" />,
      children: <Settings />,
    },
  ]

  return (
    <RequestProvider>
      <LayoutTeacher
        title="My Profile"
        breadcrumbs={breadcrumbs}
        className="bg-[#F2F4F7] p-0"
      >
        <div className="h-fit w-full rounded-2xl bg-transparent md:bg-white md:p-6 md:shadow-card lg:px-10 lg:py-8">
          <div className="relative">
            <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
              <ProfileHeader
                reViewImageSrc={reViewImageSrc}
                setReViewImageSrc={setReViewImageSrc}
                setAvatar={handleSetAvatar}
                avatar={avatar}
                isEdit={isEdit}
                inputFileRef={inputFileRef}
                setIsEdit={setIsEdit}
              />

              <div>
                <Tabs
                  className="sapp-tabs-profile hidden md:block"
                  defaultActiveKey="my-profile"
                  items={items}
                />
              </div>
            </div>
          </div>
        </div>
      </LayoutTeacher>
    </RequestProvider>
  )
}

export default withAuthorization([UserType.TEACHER])(MyProfilePage)
