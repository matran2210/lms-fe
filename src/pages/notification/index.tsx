import SearchForm from '@components/mycourses/Search'
import NotifyTab from '@components/notification/NotifyTab'
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import ActionCell from '@components/base/action/ActionCell'
import NotifyList from '@components/notification/NotifyList'
import NotifyListSetting from '@components/notification/NotifyListSetting'

// Config Tabs
const tabs = [
  { label: 'All', path: 'tab1', current: true },
  { label: 'Unread', path: 'tab2', total: 34, current: false },
]

// Config NotifyListSettings
const notifyListSettings = [
  { message: 'Mark all as read' },
  { message: 'Settings' },
]

// Config Tabs
const notifyLists = [
  {
    message:
      '<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. <strong>Duy Anh</strong> has been the industrys standard dummy text ever since the 1500s.</p>',
    readStatus: false,
    time: 35,
  },
  {
    message:
      '<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. <strong>Duy Anh</strong> has been the industrys standard dummy text ever since the 1500s.</p>',
    readStatus: true,
    time: 35,
  },
  {
    message:
      '<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. <strong>Duy Anh</strong> has been the industrys standard dummy text ever since the 1500s.</p>',
    readStatus: true,
    time: 35,
  },
  {
    message:
      '<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. <strong>Duy Anh</strong> has been the industrys standard dummy text ever since the 1500s.</p>',
    readStatus: false,
    time: 35,
  },
  {
    message:
      '<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. <strong>Duy Anh</strong> has been the industrys standard dummy text ever since the 1500s.</p>',
    readStatus: false,
    time: 35,
  },
  {
    message:
      '<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. <strong>Duy Anh</strong> has been the industrys standard dummy text ever since the 1500s.</p>',
    readStatus: false,
    time: 35,
  },
  {
    message:
      '<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. <strong>Duy Anh</strong> has been the industrys standard dummy text ever since the 1500s.</p>',
    readStatus: true,
    time: 35,
  },
  {
    message:
      '<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. <strong>Duy Anh</strong> has been the industrys standard dummy text ever since the 1500s.</p>',
    readStatus: false,
    time: 35,
  },
]

const Notifications = () => {
  const [open, setOpen] = useState<boolean>(false)
  const showTooltip = () => {
    setOpen(true)
  }

  return (
    <>
      <div className="header bg-white border-b border-default">
        <div className="max-w-xxl my-0 mx-auto flex py-[18px]">
          <SearchForm
            placeholder="Find..."
            formStyle="w-full flex items-center"
          />
        </div>
      </div>
      <div className="main max-w-xxl my-0 mx-auto pt-6">
        <h2 className="text-medium-sm font-semibold text-bw-1 pb-6">
          Notifications
        </h2>
      </div>
      <div className="heading bg-white max-w-xxl my-0 px-6 mx-auto flex justify-between">
        <NotifyTab
          tabs={tabs}
          classUl="tab-buttons d-flex flex gap-10"
          currentClass="activecolor text-bw-1 absolute w-full h-px bg-primary bottom-0 left-0"
          tabClass="item text-base relative py-4.5 block"
          tabCurrentClass="text-bw-1"
          tabNotCurrentClass="text-gray-1"
        />
        <div
          className="settings flex items-center relative"
          onClick={showTooltip}
        >
          <ActionCell>
            <NotifyListSetting notifyListsSettings={notifyListSettings} />
          </ActionCell>
        </div>
      </div>
      <div className="max-w-xxl my-0 mx-auto">
        <NotifyList notifyLists={notifyLists} />
      </div>
    </>
  )
}

export default Notifications
