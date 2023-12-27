// ConfirmDialog.tsx
import SappTable from '@components/base/SappTable'
import SappModal from '@components/base/modal/SappModal'
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'
import Icon from '@components/icons'
import EntrancePopupContent from './EntrancePopupContent'
import EntranceTestFillForm from './EntranceTestFillForm'
import { useAppSelector } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'
import CourseTestApi from 'src/redux/services/Course/MyCourse/Test'

// define the props for the confirm dialog component
export type EntrancePopupProps = {
  open: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
  entrancePopupContent?: any
}

// create the confirm dialog component
const EntrancePopup: FC<EntrancePopupProps> = ({
  open,
  setOpen,
  entrancePopupContent,
}) => {
  // Config ListResults
  // const entrancePopupContent = {
  //   name: 'ACCA F1 Entrance Test',
  //   score: 0,
  //   timeAllow: 10800,
  //   attemps: 'Unlimited',
  //   status: 'Unfinish',
  // }
  const { user } = useAppSelector(userReducer)

  const handleOnClick = () => {
    setOpen && setOpen(false)
    // setOpenFillForm(true)
  }
  const [openFillForn, setOpenFillForm] = useState(false)
  const [quizDetail, setQuizDetail] = useState() as any
  useEffect(() => {
    async function getQuizDetail() {
      const res = await CourseTestApi.getQuizDetail(entrancePopupContent.id)
      setQuizDetail(res.data)
    }
    if (open) {
      getQuizDetail()
    }
  }, [open])
  const checkFinished = useMemo(() => {
    if (quizDetail?.attempts.lenght === 0) {
      return true
    }
    for (let i in quizDetail?.attempts) {
      if (quizDetail?.attempts[i].status === 'SUBMITTED') {
        return true
      }
    }
    return false
  }, [quizDetail?.attempts])
  return (
    <>
      <SappModal
        open={open}
        setOpen={setOpen}
        cancelButtonCaption="Cancel"
        okButtonCaption="Start"
        handleCancel={handleOnClick}
        handleSubmit={() => setOpenFillForm(true)}
        showHeader={false}
        // size="max-w-1/2"
        footerButtonClassName="justify-between flex"
        childClass=""
        parentChildClass=""
        position="center"
        closeAfterSubmit={false}
        buttonSize="extra"
      >
        <h2 className="text-xl font-bold text-bw-1 mb-4">Entrance Test</h2>
        <div
          className="cursor-pointer"
          // onClick={() => {
          //   handleOnClick()
          // }}
        >
          <EntrancePopupContent
            name={quizDetail?.name || ''}
            score={entrancePopupContent.score}
            timeAllow={quizDetail?.quiz_timed}
            attemps={`${quizDetail?.attempts?.length}/${
              quizDetail?.is_limited ? quizDetail?.limit_count : 'Unlimited'
            }`}
            status={checkFinished}
          />
        </div>
      </SappModal>
      <EntranceTestFillForm open={openFillForn} setOpen={setOpenFillForm} />
    </>
  )
}

export default EntrancePopup
