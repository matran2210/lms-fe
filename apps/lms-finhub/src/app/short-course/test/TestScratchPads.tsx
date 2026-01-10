'use client'
import { CloseIcon, CloseIconNote } from '@lms/assets'
import { IExhibit, ScratchPadValue } from '@lms/core'
import { CalculatorModal } from '@lms/feature-courses'
import {
  EditorReader,
  FileViewer,
  ModalResizeable
} from '@lms/ui'
import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import ScratchPatch from './scratchPatch'
import { useSmartModalSize } from '@lms/hooks'
interface IProps {
  openScratchPad: any[]
  onFocusingPad: string
  setOnFocusingPad: Dispatch<SetStateAction<string>>
  handleCloseScratchPad: (pad: any) => void
  currentPage: any
  scratchPads: string
  setScratchPads: Dispatch<SetStateAction<string>>
  exhibitData: IExhibit[] | undefined
  setScratchPadValues: Dispatch<SetStateAction<ScratchPadValue[]>>
  scratchPadValues: ScratchPadValue[]
  exhibitText?: string
}

const TestScratchPads = ({
  openScratchPad,
  onFocusingPad,
  setOnFocusingPad,
  handleCloseScratchPad,
  currentPage,
  scratchPads,
  setScratchPads,
  exhibitData,
  scratchPadValues,
  setScratchPadValues,
  exhibitText = 'Exhibit',
}: IProps) => {
  const handleChangeScratchPad = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id?: string,
  ) => {
    const { value } = e.target

    const index = scratchPadValues?.findIndex(
      (item: ScratchPadValue) => item.id === currentPage,
    )
    if (index !== -1) {
      setScratchPadValues((prevScratchPads: ScratchPadValue[]) => {
        const newScratchPads = [...prevScratchPads]
        newScratchPads[index].value = value
        return newScratchPads
      })
    } else {
      setScratchPadValues((prevScratchPads: ScratchPadValue[]) => [
        ...prevScratchPads,
        {
          id: currentPage,
          value: value,
        },
      ])
    }
  }
  const { control: controlScratch } = useForm()
  const { width: widthFileViewer, height: heightFileViewer } =
    useSmartModalSize()
  return openScratchPad.map((e, index: number) => {
    if (e.type === 'calculator') {
      return (
        <CalculatorModal
          key={e.id}
          onClick={() => setOnFocusingPad(e?.id)}
          onClose={() => handleCloseScratchPad(e)}
        />
      )
    } else if (e.type === 'scratch_pad') {
      return (
        <ModalResizeable
          position="center left"
          key={currentPage}
          header={({ requestClose }) => (
            <div className="modal-header modal-dragger flex w-full cursor-move items-center justify-between rounded-t-xl bg-gray-100 px-4 py-3">
              <div className="text-sm font-semibold text-gray-800">
                Scratch Pad
              </div>
              <button
                className="text-icon"
                onClick={(e) => {
                  e.stopPropagation()
                  requestClose()
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation()
                  requestClose()
                }}
              >
                <CloseIconNote />
              </button>
            </div>
          )}
          handleCloseScratchPad={() => {
            handleCloseScratchPad(e)
          }}
          onClick={() => {
            setOnFocusingPad(e?.id)
          }}
          width={412}
          height={350}
        >
          <ScratchPatch
            scratchPadValues={scratchPadValues.find(
              (el) => el.id === currentPage,
            )}
            control={controlScratch}
            scratchPads={scratchPads}
            handleChangeScratchPad={(event: ChangeEvent<HTMLInputElement>) => {
              setScratchPads(event.target.value)
              handleChangeScratchPad(event, currentPage)
            }}
            className="!h-fit"
          />
        </ModalResizeable>
      )
    } else if (e.type === 'exhibits') {
      const i = exhibitData?.findIndex((el: any) => el?.id === e?.id)
      const exhibitsDes = exhibitData?.find((exhibit) => exhibit?.id === e?.id)
      return (
        <ModalResizeable
          key={e.id}
          handleCloseScratchPad={() => handleCloseScratchPad(e)}
          position="center left"
          header={({ requestClose }) => (
            <div className="modal-header modal-dragger flex w-full cursor-move items-center justify-between rounded-t-xl bg-gray-100 px-4 py-3">
              <div className="text-sm font-semibold text-gray-800">
                {`${exhibitText} ${(i ?? 0) + 1}: ${exhibitsDes?.name}`}
              </div>
              <button
                className="text-icon"
                onClick={() => {
                  e.stopPropagation()
                  requestClose()
                }}
              >
                <CloseIcon />
              </button>
            </div>
          )}
          draggableFull
          modalIndex={i}
        >
          <div className="h-[calc(100%-40px)] overflow-auto bg-white p-5">
            <EditorReader
              text_editor_content={exhibitsDes?.description}
              className="w-full"
            />
            {exhibitsDes &&
              exhibitsDes?.files?.length > 0 &&
              exhibitsDes?.files?.map((e: any, index: number) => {
                return (
                  <div key={index} className="h-full overflow-auto bg-white">
                    <FileViewer
                      fileName={e?.resource?.name}
                      fileUrl={e?.resource?.url}
                    />
                  </div>
                )
              })}
          </div>
        </ModalResizeable>
      )
    } else if (e.type === 'file') {
      return (
        <ModalResizeable
          title={e.fileName}
          width={widthFileViewer}
          height={heightFileViewer}
          key={e.id}
          handleCloseScratchPad={() => handleCloseScratchPad(e)}
          position="center"
        >
          <div
            className="overflow-auto bg-white p-4"
            style={{ height: 'calc(100% - 40px)' }}
          >
            {/* <div className='flex flex-'> */}
            <FileViewer fileName={e?.fileName} fileUrl={e?.file} />
          </div>
          {/* </div> */}
        </ModalResizeable>
      )
    }
  })
}

export default TestScratchPads
