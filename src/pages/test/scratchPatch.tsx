import HookFormTextArea from '@components/base/textfield/HookFormTextArea'
import { Control } from 'react-hook-form'

type ScratchPadValue = {
  question_id: string
  scratch_pad: string
}

interface IProps {
  scratchPadValues?: ScratchPadValue | null | undefined
  control: Control<any>
  handleChangeScratchPad: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >
}
const ScratchPatch = ({
  scratchPadValues,
  control,
  handleChangeScratchPad,
}: IProps) => {
  return (
    <HookFormTextArea
      control={control}
      name={scratchPadValues?.question_id ?? ''}
      defaultValue={scratchPadValues?.scratch_pad ?? ''}
      onChange={handleChangeScratchPad}
      className="w-full h-[calc(100%-40px)] sapp-text-area px-5 py-3 placeholder:text-sm placeholder:font-normal not-resizer"
    />
  )
}

export default ScratchPatch
