import HookFormTextArea from '@components/base/textfield/HookFormTextArea'
import { Control } from 'react-hook-form'

type ScratchPadValue = {
  id: string
  value: string
}

type ScratchPad = {
  question_id: string
  id: string
  scratch_pad: string
}
interface IProps {
  scratchPadValues?: ScratchPadValue | null | undefined
  control: Control<any>
  scratchPads: ScratchPad | null | undefined
  handleChangeScratchPad: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >
}
const ScratchPatch = ({
  scratchPadValues,
  control,
  scratchPads,
  handleChangeScratchPad,
}: IProps) => {
  return (
    <HookFormTextArea
      placeholder="Take a note..."
      control={control}
      name={scratchPadValues?.id ?? ''}
      defaultValue={scratchPads?.scratch_pad ?? ''}
      onChange={handleChangeScratchPad}
      className="sapp-text-area not-resizer h-[calc(100%-2.5rem)] w-full px-5 py-3 placeholder:text-sm placeholder:font-normal"
    />
  )
}

export default ScratchPatch
