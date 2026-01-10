import { HandShake } from '@lms/assets'
import { RefObject } from 'react'
import { CoursesAPI } from 'src/pages/api/courses'
import { clearGuideState, increment } from '@lms/contexts'
import { ButtonPrimary, ButtonText, SappModal } from '@lms/ui'
import { UserGuide } from '@lms/core'
import { useAppDispatch } from 'src/redux/hook'
type Props = {
  confirmDialogOverLayRef: RefObject<HTMLDivElement>
}

const PopupWelcome = ({ confirmDialogOverLayRef }: Props) => {
  const dispatch = useAppDispatch()
  const handleNextStep = async () => {
    dispatch(increment())
    await activeUserGuide()
  }

  async function activeUserGuide() {
    try {
      await CoursesAPI.userGuideActive()
    } catch (error) {}
  }
  const closeUserGuide = () => {
    if (confirmDialogOverLayRef.current) {
      confirmDialogOverLayRef.current.classList.add('animate-fade-out-overlay')
      confirmDialogOverLayRef.current.classList.add('pointer-events-none')
    }
    // Remove hidden scroll when close user guide
    document.body.style.removeProperty('padding-right')
    document.body.classList.remove('overflow-hidden')
    setTimeout(() => {
      dispatch(clearGuideState())
    }, 50)
  }

  return (
    <>
      <SappModal
        open={true}
        okButtonCaption={'Yes'}
        cancelButtonCaption={'No'}
        size="max-w-[560px]"
        position="center"
        showHeader={false}
        showFooter={false}
        childClass={'text-center p-'}
        overlayClass={'!hidden'}
        isContentFull={true}
        refClass={
          'animate-jump-in relative transform overflow-hidden shadow-xl transition-all rounded-xl'
        }
      >
        <div className="flex flex-col items-center p-10 text-gray-v2-800">
          <HandShake />
          <h2 className="mb-8 mt-10 text-3xl font-bold ">
            {UserGuide.TITLE_WELCOME}
          </h2>
          <span className="text-medium-s">{UserGuide.CONTENT_WELCOME}</span>
          <ButtonPrimary
            title={UserGuide.CONTENT_BUTTON}
            full={true}
            className="mt-10"
            size="medium"
            onClick={() => handleNextStep()}
          />
          <ButtonText
            title={'Skip'}
            className="mt-3 pb-0"
            onClick={closeUserGuide}
          />
        </div>
      </SappModal>
    </>
  )
}

export default PopupWelcome
