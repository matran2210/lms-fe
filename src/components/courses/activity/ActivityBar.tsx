import React from 'react'
import { DocumentAdd } from '../icons/DocumentAdd'
import ButtonIcon from '../buttons/ButtonIcon'
import { Archive } from '../icons/Archive'
import { Soundwave } from '../icons/Soundwave'
import { List } from '../icons/List'
import { ActivityBarProps, IActivityTab } from 'src/type/courses-3-level'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { pushNotes } from 'src/redux/slice/Course/ShortCourse/NoteList/ShortNoteList'

const tabs: IActivityTab[] = [
  { key: 'add-note', icon: <DocumentAdd /> },
  { key: 'resource', icon: <Archive /> },
  { key: 'timeline', icon: <Soundwave /> },
]

export default function ActivityBar({
  activeTab,
  onTabChange,
}: ActivityBarProps) {
  const getButtonClass = (tabKey: string) =>
    `p-2 rounded-lg overflow-hidden ${activeTab === tabKey ? 'text-primary bg-white' : 'text-white bg-primary'} hover:text-primary hover:bg-white`

  const dispatch = useDispatch()

  const handleTabChange = (tabKey: string) => {
    if (tabKey === 'add-note') {
      const note = {
        uuid: uuidv4(),
        id: '',
        name: 'Note',
        description: '',
      }
      dispatch(pushNotes(note))
    }

    onTabChange(tabKey)
  }

  return (
    <div className="fixed bottom-8 left-4 z-[1010] flex w-[calc(100%-32px)] justify-between overflow-hidden rounded-lg bg-primary p-2 shadow-activity lg:hidden">
      <div className="flex gap-3">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={getButtonClass(tab.key)}
            onClick={() => handleTabChange(tab.key)}
          >
            {tab.icon}
          </div>
        ))}
      </div>
      <ButtonIcon
        title="Section content"
        onClick={() => onTabChange('content')}
        className={getButtonClass('content')}
      >
        <List />
      </ButtonIcon>
    </div>
  )
}
