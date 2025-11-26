import React from 'react'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import clsx from 'clsx'
import { ActivityBarProps, IActivityTab } from '@lms/core'
import { DocumentAdd } from '../icons/DocumentAdd'
import { DocumentText } from '../icons/DocumentText'
import { Archive } from '../icons/Archive'
import { Soundwave } from '../icons'
import { activeNotesList3Level, pushNotes3Level } from '@lms/contexts'
import { List } from '../icons/List'
import ButtonIcon from '../buttons/ButtonIcon'

const tabs: IActivityTab[] = [
  { key: 'add-note', icon: <DocumentAdd /> },
  { key: 'note-list', icon: <DocumentText /> },
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
    switch (tabKey) {
      case 'add-note':
        const note = {
          uuid: uuidv4(),
          id: '',
          name: 'Note',
          description: '',
        }
        dispatch(pushNotes3Level(note))
        break
      case 'note-list':
        dispatch(activeNotesList3Level())
        break
    }

    onTabChange(tabKey)
  }

  return (
    <div className="fixed bottom-8 left-4 z-[1010] flex w-[calc(100%-32px)] justify-between overflow-hidden rounded-lg bg-primary px-4 py-2 shadow-activity lg:hidden">
      <div className="flex gap-1">
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
        className={clsx(getButtonClass('content'), 'gap-2')}
        classTitle="text-v2-sm font-normal"
      >
        <List />
      </ButtonIcon>
    </div>
  )
}
