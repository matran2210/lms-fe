import React, { useState } from 'react'
import { useAppSelector } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'
import ProfileItem from './ProfileItem'
import SappDrawer from '@components/base/SappDrawer'
import { getMe, makeContactDefault } from 'src/redux/slice/User/User'
import { useAppDispatch } from 'src/redux/hook'
import ProfileCard from '@components/card/ProfileCard'
import SappDrawerV2 from '@components/base/drawer/SappDrawerV2'
import Icon from '@components/icons'
import { Divider, Switch } from 'antd'
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
  return (
    <ProfileCard title="Profile">
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
          title={'Profile ' + makeDefaultDrawer?.index || ''}
          handleCancel={closeMakeDefault}
        >
          <div className="flex flex-col gap-4">
            {makeDefaultDrawer?.phone && (
              <div className="flex items-center justify-between text-bw-1">
                <span className="inline-block w-[302px] text-gray-14">
                  <div className="flex">
                    <Icon type="phone-ring" className="mr-2" /> Phone Number:
                  </div>
                </span>
                <span className="font-medium">
                  {makeDefaultDrawer?.phone || ''}{' '}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-bw-1">
              <span className="inline-block w-[302px] text-gray-14">
                <div className="flex">
                  <Icon type="email" className="mr-2" /> Email Adress:
                </div>
              </span>
              <span className="font-medium">
                {makeDefaultDrawer?.email || ''}
              </span>
            </div>
            {makeDefaultDrawer?.address && (
              <div className="mt-5 text-bw-1">
                <span className="inline-block w-[302px] text-gray-14">
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
              <span className="text-base font-semibold text-gray-14">
                Set as default:
              </span>
              <Switch className="sapp-profile-switch" />
            </div>
          </div>
        </SappDrawerV2>
      )}
    </ProfileCard>
  )
}

export default ProfileList
