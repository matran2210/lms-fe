import { CloseIcon } from '@assets/icons'
import CloseModalIcon from '@assets/icons/CloseModalIcon'
import EditorReader from '@components/base/editor/EditorReader'
import FileViewer from '@components/base/fileViewer/FileViewer'
import ModalResizeable from '@components/base/modal/ModalResizeable'
import MovableWindow from '@components/base/window'
import Calculator from '@components/calculator'
import { Triangle } from '@components/icons/Triangle'
import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { ScratchPadValue } from 'src/type'
import { IExhibit } from 'src/type/exhibit'
import ScratchPatch from './scratchPatch'
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
    e: ChangeEvent<HTMLInputElement>,
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

  return openScratchPad.map((e, index: number) => {
    if (e.type === 'calculator') {
      return (
        <MovableWindow
          position={{
            width: '344px',
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
          <div className="absolute left-0 top-0 h-full w-fit rounded-xl">
            <div className="flex h-fit w-full items-center justify-between rounded-t-xl border border-b-0 border-gray-12 bg-gray-100 px-4 py-3">
              <div className="text-sm font-bold">Calculator</div>
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
            width: '412px',
            height: '312px',
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
            <div className="flex w-full items-center justify-between bg-gray-100 px-4 py-3">
              <div className="text-sm font-bold">Scratch Pad</div>
              {/* <CloseIcon */}
              <button onClick={() => handleCloseScratchPad(e)}>
                <CloseModalIcon />
              </button>
            </div>
            <ScratchPatch
              scratchPadValues={scratchPadValues.find(
                (el) => el.id === currentPage,
              )}
              control={controlScratch}
              scratchPads={scratchPads}
              handleChangeScratchPad={(
                event: ChangeEvent<HTMLInputElement>,
              ) => {
                setScratchPads(event.target.value)
                handleChangeScratchPad(event, currentPage)
              }}
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
