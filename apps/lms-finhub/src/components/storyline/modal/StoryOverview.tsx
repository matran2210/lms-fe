'use client'
import { SappModalV3 } from '@lms/ui'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction } from 'react'
import LearningItem from './LearningItem'
interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  storylineId: string
  name: string
}

const StoryOverview = ({ open, setOpen, storylineId, name }: IProps) => {
  const router = useRouter()
  const onClose = () => {
    setOpen(false)
  }
  const handleSubmit = () => {
    router.push(`/story/${storylineId}`)
  }
  const status = 'continue' // 'continue' | 'complete' | 'not started'

  return (
    <>
      <SappModalV3
        handleClose={onClose}
        open={open}
        handleCancel={onClose}
        title={name || 'Storyline - HR Value Chain'}
        isShowBtnClose
        closable
        isShowFooter
        submitButtonClassName="w-full h-10"
        onOk={handleSubmit}
        cancelButtonCaption={'Cancel'}
        okButtonCaption={
          status === 'continue' ? 'Continue where you left' : 'Start'
        }
      >
        <div className="flex flex-col gap-10 text-left">
          <div className="mt-10 text-base leading-6 text-gray-800">
            Hello and welcome to this Case Study. 
            <br />
            <br />
            In this exercise, you will find yourself in the role of HR Manager
            at the US-based call center operator Telline and apply the HR value
            chain to analyze some of their HR metrics.
          </div>

          <div className="flex flex-col gap-4">
            <div className="text-lg font-semibold leading-7 text-gray-800">
              This Story Include:
            </div>
            <div className="flex flex-col items-start justify-start gap-3">
              <LearningItem name={'Introduction'} progress={100} />
              <LearningItem name={'Tasks'} progress={50} />
              <LearningItem name={'Summary'} progress={50} />
            </div>
          </div>
        </div>
      </SappModalV3>
    </>
  )
}

export default StoryOverview
