import { CloseIcon, ConfirmIcon } from '@assets/icons'
import SappButton from '@components/base/button/SappButton'
import SappModalV2 from '@components/base/modal/SappModalV2'
import HookFormTextArea from '@components/base/textfield/HookFormTextArea'
import MovableWindow from '@components/base/window'
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
  scratchPadValues?: ScratchPadValue
  control: Control<any>
  scratchPads: ScratchPad
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
      className="w-full h-[calc(100%-40px)] sapp-text-area px-5 py-3 placeholder:text-sm placeholder:font-normal not-resizer"
    />
  )
}

export default ScratchPatch
