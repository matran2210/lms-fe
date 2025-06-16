import React, { useState } from 'react'
import { useAppSelector } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'
import ProfileItem from './ProfileItem'
import { getMe, makeContactDefault } from 'src/redux/slice/User/User'
import { useAppDispatch } from 'src/redux/hook'
import ProfileCard from '@components/card/ProfileCard'
import SappDrawerV2 from '@components/base/drawer/SappDrawerV2'
import Icon from '@components/icons'
import { Divider, Select, Switch } from 'antd'
import { IUserContact } from 'src/redux/types/User/urser'
import { CollapseArrowIcon } from '@assets/icons'
import clsx from 'clsx'
interface ProfileOptionItem {
  label: string
  value: string
  email: string
  phone: string
  address: string
  index: number
  id: string
  is_default: boolean
}
interface IProps {
  isEdit: boolean
}
const ProfileList = ({ isEdit }: IProps) => {
  const { user } = useAppSelector(userReducer)
  const dispatch = useAppDispatch()

  const [makeDefaultDrawer, setMakeDefaultDrawer] = useState<{
    status: boolean
    email: string
    phone: string
    address: string
    index: number
    id: string
    is_default: boolean
  }>()
  const closeMakeDefault = () => {
    setMakeDefaultDrawer(undefined)
  }
  const submitMakeDefault = async () => {
    try {
      if (makeDefaultDrawer?.id) {
        await dispatch(makeContactDefault(makeDefaultDrawer.id))
          .unwrap()
          .then(async (e) => {
            setMakeDefaultDrawer(undefined)
            await dispatch(getMe())
          })
      }
    } catch (error) {}
  }
  const handleSetDefault = (checked: boolean) => {
    if (checked) {
      submitMakeDefault()
    }
  }
  /**
   * Sắp xếp mảng người dùng theo thời gian tạo và is_default.
   *
   * @param {Array} users - Mảng người dùng cần sắp xếp.
   * @returns {Array} - Mảng đã sắp xếp theo is_default và created_at.
   */
  const sortByCreatedAtAndDefault = (users: Array<any>) => {
    const sortedUsers = [...users]

    sortedUsers.sort((a, b) => {
      if (a?.is_default && !b?.is_default) return -1
      if (!a?.is_default && b?.is_default) return 1

      const dateA = new Date(a?.created_at)
      const dateB = new Date(b?.created_at)

      return dateB?.getTime() - dateA?.getTime()
    })

    return sortedUsers
  }
  const profileOptions: ProfileOptionItem[] = sortByCreatedAtAndDefault(
    user?.user_contacts || [],
  ).map((data: IUserContact, index) => {
    return {
      label: `Profile ${index + 1}`,
      value: data?.id,
      email: data?.email,
      phone: data?.phone,
      address: data?.address,
      index: index + 1,
      id: data?.id,
      is_default: data?.is_default,
    }
  })
  return (
    <ProfileCard
      title="Profile"
      className={clsx({ 'hidden lg:block': isEdit })}
    >
      {sortByCreatedAtAndDefault(user?.user_contacts || [])?.map((e, i) => {
        return (
          <ProfileItem
            key={e.id}
            data={e}
            index={i}
            isEdit={isEdit}
            setMakeDefaultDrawer={setMakeDefaultDrawer}
          />
        )
      })}
      {makeDefaultDrawer?.status && (
        <SappDrawerV2
          open={makeDefaultDrawer?.status || false}
          onClose={closeMakeDefault}
          title={
            <Select
              suffixIcon={<CollapseArrowIcon selected />}
              value={makeDefaultDrawer?.id}
              onChange={(value, option) => {
                if (!Array.isArray(option) && option) {
                  setMakeDefaultDrawer({
                    id: value,
                    email: option.email,
                    phone: option.phone,
                    address: option.address,
                    index: option.index,
                    is_default: option.is_default,
                    status: true,
                  })
                }
              }}
              variant="borderless"
              className="profile-subject-select"
              options={profileOptions}
            />
          }
          handleCancel={closeMakeDefault}
          classNameHeader={'bg-white !text-black md:p-0 lg:px-8 lg:py-6'}
          classNameBody="md:px-0 lg:px-8"
          rootClassName={'profile-subject-drawer'}
          classNames={{
            content: 'md:rounded-2xl',
          }}
        >
          <div className="flex flex-col gap-4">
            {makeDefaultDrawer?.phone && (
              <div className="flex items-center justify-between text-[#050505]">
                <span className="inline-block w-[302px] text-secondary">
                  <div className="flex">
                    <Icon type="phone-ring" className="mr-2" /> Phone Number:
                  </div>
                </span>
                <span className="font-medium">
                  {makeDefaultDrawer?.phone || ''}{' '}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-[#050505]">
              <span className="inline-block w-[302px] text-secondary">
                <div className="flex">
                  <Icon type="email" className="mr-2" /> Email Adress:
                </div>
              </span>
              <span className="font-medium">
                {makeDefaultDrawer?.email || ''}
              </span>
            </div>
            {makeDefaultDrawer?.address && (
              <div className="mt-5 text-[#050505]">
                <span className="inline-block w-[302px] text-secondary">
                  {' '}
                  Address:{' '}
                </span>
                <span className="font-medium">
                  {makeDefaultDrawer?.address || ''}{' '}
                </span>
              </div>
            )}
          </div>
          <Divider />

          <div>
            <div className="flex items-center gap-4">
              <span className="text-base font-semibold text-secondary">
                Set as default:
              </span>
              <Switch
                className="sapp-profile-switch"
                checked={makeDefaultDrawer.is_default}
                onChange={handleSetDefault}
                disabled={makeDefaultDrawer.is_default}
              />
            </div>
          </div>
        </SappDrawerV2>
      )}
    </ProfileCard>
  )
}

export default ProfileList
