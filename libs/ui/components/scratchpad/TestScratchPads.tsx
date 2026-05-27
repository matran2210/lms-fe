'use client'
import { CloseIconNote, Triangle } from '@lms/assets'
import { IExhibit, ScratchPadValue } from '@lms/core'
import CalculatorModal from '../calculator-modal/CalculatorModal'
import { useSmartModalSize } from '@lms/hooks'
import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import ScratchPatch from './scratchPatch' 
import { TestServiceAPI } from 'src/api/test-api'
import { EditorReader, FileViewer, ModalResizeable } from '../base'
interface IProps {
  openScratchPad: any[]
  focusingPadId: string
  setFocusingPadId: Dispatch<SetStateAction<string>>
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
  focusingPadId,
  setFocusingPadId,
  handleCloseScratchPad,
  currentPage,
  scratchPads,
  setScratchPads,
  exhibitData,
  scratchPadValues,
  setScratchPadValues,
  exhibitText = 'Exhibit',
}: IProps) => {
  const handleChangeScratchPad = (e: ChangeEvent<HTMLInputElement>) => {
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
  const { width: widthFileViewer, height: heightFileViewer } =
    useSmartModalSize()
  const { control: controlScratch } = useForm()

  return openScratchPad.map((e, index: number) => {
    if (e.type === 'calculator') {
      return (
        <CalculatorModal
          key={e.id}
          onClick={() => setFocusingPadId(e.id)}
          onClose={() => handleCloseScratchPad(e)}
          modalIndex={index}
          isTopModal={focusingPadId === e.id}
        />
      )
    } else if (e.type === 'scratch_pad') {
      return (
        <ModalResizeable
          position="center"
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
                  setTimeout(() => handleCloseScratchPad(e), 300)
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
          onClose={() => {
            handleCloseScratchPad(e)
          }}
          onModalFocus={() => {
            setFocusingPadId(e?.id)
          }}
          width={412}
          height={350}
          modalIndex={index}
          contentClassName="!overflow-hidden"
          isTopModal={focusingPadId === e.id}
        >
          <ScratchPatch
            scratchPadValues={scratchPadValues.find(
              (el) => el.id === currentPage,
            )}
            control={controlScratch}
            scratchPads={scratchPads}
            handleChangeScratchPad={(event: ChangeEvent<HTMLInputElement>) => {
              setScratchPads(event.target.value)
              handleChangeScratchPad(event)
            }}
            className="!h-full"
          />
        </ModalResizeable>
      )
    } else if (e.type === 'exhibits') {
      const i = exhibitData?.findIndex((el: any) => el?.id === e?.id)
      const exhibitsDes = exhibitData?.find((exhibit) => exhibit?.id === e?.id)
      return (
        <ModalResizeable
          key={e.id}
          onClose={() => handleCloseScratchPad(e)}
          position="center"
          modalIndex={i}
          isTopModal={focusingPadId === e.id}
          onModalFocus={() => setFocusingPadId(e?.id as string)}
          header={({ requestClose }) => (
            <div className="relative">
              <div className="modal-header modal-dragger flex h-10 w-full cursor-move items-center justify-between bg-white px-5">
                <div className="truncate">
                  <span className="text-base font-semibold">{`${exhibitText} ${(i ?? 0) + 1
                    }: `}</span>
                  {exhibitsDes?.name}
                </div>
              </div>
              <button
                className="absolute right-3 top-2"
                onClick={() => {
                  requestClose()
                  setTimeout(() => handleCloseScratchPad(e), 300)
                }}
              >
                <CloseIconNote />
              </button>
            </div>
          )}
          draggableFull
        >
          <div className="h-full bg-white px-4 py-3">
            <EditorReader
              text_editor_content={exhibitsDes?.description}
              className="w-full"
            />
            {exhibitsDes &&
              exhibitsDes?.files?.length > 0 &&
              exhibitsDes?.files?.map((e: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="h-full cursor-pointer overflow-auto bg-white"
                  >
                    <FileViewer
                      fileName={e?.resource?.name}
                      fileUrl={e?.resource?.url}
                      onDownload={() => TestServiceAPI.downloadFile({ files: [{ name: e?.resource?.name, file_key: e?.resource?.file_key }] })}
                    />
                  </div>
                )
              })}
          </div>
          <Triangle className="absolute bottom-2 right-2" />
        </ModalResizeable>
      )
    } else if (e.type === 'file') {
      return (
        <ModalResizeable
          title={e.fileName}
          width={widthFileViewer}
          height={heightFileViewer}
          key={e.id}
          onClose={() => handleCloseScratchPad(e)}
          position="center"
          draggableFull
          modalIndex={index}
          isTopModal={focusingPadId === e.id}
          onModalFocus={() => setFocusingPadId(e?.id as string)}
        >
          <div
            className="overflow-auto bg-white p-4"
            style={{ height: 'calc(100% - 40px' }}
          >
            {/* <div className='flex flex-'> */}
            <FileViewer fileName={e?.fileName} fileUrl={e?.file} onDownload={() => TestServiceAPI.downloadFile({ files: [{ name: e?.fileName, file_key: e?.fileKey }] })} />
          </div>
          {/* </div> */}
        </ModalResizeable>
      )
    }
  })
}

export default TestScratchPads
