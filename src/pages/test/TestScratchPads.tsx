import { CloseIcon } from '@assets/icons'
import EditorReader from '@components/base/editor/EditorReader'
import ModalResizeable from '@components/base/modal/ModalResizeable'
import PdfViewer from '@components/base/pdf/pdf-viewer'
import MovableWindow from '@components/base/window'
import Calculator from '@components/calculator'
import { ChangeEvent, Dispatch, SetStateAction, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ScratchPad, ScratchPadValue } from 'src/type'
import { IExhibit } from 'src/type/exhibit'
import ScratchPatch from './scratchPatch'
import { isPdfFile } from '@utils/helpers'
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
          <div className="absolute left-0 top-0  h-full w-full border">
            <div className="flex h-10 w-full items-center justify-between bg-gray-2 px-5">
              <div className="text-sm font-normal">Calculator</div>
              <button onClick={() => handleCloseScratchPad(e)}>
                <CloseIcon />
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
          <div className="absolute left-0 top-0  h-full w-full border">
            <div className="flex h-10 w-full items-center justify-between bg-gray-2 px-5">
              <div className="text-sm font-normal">Scratch Pad</div>
              {/* <CloseIcon */}
              <button onClick={() => handleCloseScratchPad(e)}>
                <CloseIcon />
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
          position="bottom left"
          header={
            <div className="relative">
              <div className="modal-header flex h-10 w-full cursor-move items-center justify-between bg-white px-5">
                <div className="truncate">
                  <span className="text-base font-semibold">{`${exhibitText} ${
                    (i ?? 0) + 1
                  }: `}</span>
                  {exhibitsDes?.name}
                </div>
              </div>
              <button
                className="absolute right-3 top-2"
                onClick={() => handleCloseScratchPad(e)}
              >
                <CloseIcon />
              </button>
            </div>
          }
        >
          <div className="h-[calc(100%-40px)] overflow-auto bg-white p-5">
            <EditorReader
              text_editor_content={exhibitsDes?.description}
              className=" w-full"
            />
            {exhibitsDes &&
              exhibitsDes?.files?.length > 0 &&
              exhibitsDes?.files?.map((e: any, index: number) => {
                return (
                  <div key={index} className="h-full overflow-auto bg-white">
                    {isPdfFile(e?.resource?.name) ? (
                      <iframe
                        src={e?.resource?.url}
                        width="100%"
                        height="100%"
                        style={{ border: 'none' }}
                      />
                    ) : (
                      <iframe
                        src={`${process.env.NEXT_PUBLIC_OFFICE_VIEWER_URL}?src=${encodeURIComponent(e?.resource?.url)}`}
                        width="100%"
                        height="100%"
                        style={{ border: 'none' }}
                      />
                    )}
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
            {isPdfFile(e?.fileName) ? (
              <iframe
                src={e.file}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              />
            ) : (
              <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(e.file)}`}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              />
            )}
          </div>
          {/* </div> */}
        </ModalResizeable>
      )
    }
  })
}

export default TestScratchPads
