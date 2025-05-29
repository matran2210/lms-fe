import { CloseIcon } from '@assets/icons'
import EditorReader from '@components/base/editor/EditorReader'
import FileViewer from '@components/base/fileViewer/FileViewer'
import ModalResizeable from '@components/base/modal/ModalResizeable'
import MovableWindow from '@components/base/window'
import Calculator from '@components/calculator'
import { Triangle } from '@components/icons/Triangle'
import { ChangeEvent, Dispatch, SetStateAction, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ScratchPad, ScratchPadValue } from 'src/type'
import { IExhibit } from 'src/type/exhibit'
import ScratchPatch from './scratchPatch'
import CloseModalIcon from '@assets/icons/CloseModalIcon'
interface IProps {
  openScratchPad: any[]
  onFocusingPad: string
  setOnFocusingPad: Dispatch<SetStateAction<string>>
  handleCloseScratchPad: (pad: any) => void
  currentPage: any
  scratchPads: ScratchPad[]
  setScratchPads: Dispatch<SetStateAction<ScratchPad[]>>
  exhibitData: IExhibit[] | undefined
  setScratchPadValues: Dispatch<
    SetStateAction<ScratchPadValue | null | undefined>
  >
  scratchPadValues: ScratchPadValue | null | undefined
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
    e: ChangeEvent<HTMLInputElement>,
    id?: string,
  ) => {
    const { value } = e.target
    setScratchPadValues((prevState: any) => ({
      ...prevState,
      id,
      value,
    }))
  }

  const { control: controlScratch } = useForm()

  useEffect(() => {
    if (currentPage) {
      const currentPageScratchPadValues = scratchPadValues?.value ?? ''
      const currentPageScratchPadId = scratchPadValues?.id ?? ''
      if (currentPageScratchPadValues) {
        const index = scratchPads.findIndex(
          (item: ScratchPad) => item.question_id === currentPage,
        )
        if (index !== -1) {
          setScratchPads((prevScratchPads: any) => {
            const newScratchPads = [...prevScratchPads]
            newScratchPads[index].scratch_pad = currentPageScratchPadValues
            return newScratchPads
          })
        } else {
          setScratchPads((prevScratchPads: any) => [
            ...prevScratchPads,
            {
              question_id: currentPage,
              id: currentPageScratchPadId,
              scratch_pad: currentPageScratchPadValues,
            },
          ])
        }
      }
    }
  }, [currentPage, scratchPadValues])

  return openScratchPad.map((e, index: number) => {
    if (e.type === 'calculator') {
      return (
        <MovableWindow
          position={{
            width: '400px',
            height: 'fit-content',
            top: 'calc(25% - 150px)',
            left: 'calc(25% - 200px)',
          }}
          key={e.id}
          onClick={() => setOnFocusingPad(e.id)}
          zIndex={
            onFocusingPad === e?.id ? openScratchPad?.length + 500 : index + 500
          }
        >
          <div className="absolute left-0 top-0 h-full w-full rounded-xl">
            <div className="flex h-10 w-full items-center justify-between rounded-t-xl bg-gray-2 px-5">
              <div className="text-sm font-normal">Calculator</div>
              <button onClick={() => handleCloseScratchPad(e)}>
                <CloseModalIcon />
              </button>
            </div>
            <Calculator />
          </div>
        </MovableWindow>
      )
    } else if (e.type === 'scratch_pad') {
      return (
        <MovableWindow
          position={{
            width: '400px',
            height: '300px',
            top: 'calc(50% - 150px)',
            left: 'calc(50% - 200px)',
          }}
          key={currentPage}
          onClick={() => {
            setOnFocusingPad(e?.id)
          }}
          zIndex={
            onFocusingPad === e?.id ? openScratchPad?.length + 500 : index + 500
          }
        >
          <div className="absolute left-0 top-0 h-full w-full overflow-hidden rounded-xl border">
            <div className="flex w-full items-center justify-between rounded-t-xl bg-gray-100 px-4 py-3">
              <div className="text-sm font-bold">Scratch Pad</div>
              {/* <CloseIcon */}
              <button onClick={() => handleCloseScratchPad(e)}>
                <CloseModalIcon />
              </button>
            </div>
            <ScratchPatch
              scratchPadValues={scratchPadValues}
              control={controlScratch}
              scratchPads={scratchPads.find(
                (item: ScratchPad) => item?.id === currentPage,
              )}
              handleChangeScratchPad={(event: ChangeEvent<HTMLInputElement>) =>
                handleChangeScratchPad(event, currentPage)
              }
            />
          </div>
        </MovableWindow>
      )
    } else if (e.type === 'exhibits') {
      const i = exhibitData?.findIndex((el: any) => el?.id === e?.id)
      const exhibitsDes = exhibitData?.find((exhibit) => exhibit?.id === e?.id)
      return (
        <ModalResizeable
          key={e.id}
          handleCloseScratchPad={() => handleCloseScratchPad(e)}
          position="center"
          header={
            <div className="relative mb-3 px-6">
              <div className="modal-header flex w-full items-center justify-between rounded-xl bg-white">
                <div className="truncate">
                  <span className="text-base font-semibold">{`${exhibitText} ${
                    (i ?? 0) + 1
                  }: ${exhibitsDes?.name}`}</span>
                </div>
              </div>
              <button
                className="absolute right-6 top-0"
                onClick={() => handleCloseScratchPad(e)}
              >
                <CloseIcon />
              </button>
            </div>
          }
        >
          <div className=" bg-white">
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
          <Triangle className="absolute bottom-2 right-2" />
        </ModalResizeable>
      )
    } else if (e.type === 'file') {
      return (
        <ModalResizeable
          title={e.fileName}
          width={650}
          height={850}
          key={e.id}
          handleCloseScratchPad={() => handleCloseScratchPad(e)}
          position="center"
        >
          <div
            className="overflow-auto bg-white p-4"
            style={{ height: 'calc(100% - 40px' }}
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
