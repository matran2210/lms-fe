import HookFormTextArea from '@components/base/textfield/HookFormTextArea'
import clsx from 'clsx'
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
  scratchPads: string
  handleChangeScratchPad: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >
  className?: string
}
const ScratchPatch = ({
  scratchPadValues,
  control,
  scratchPads,
  handleChangeScratchPad,
  className,
}: IProps) => {
  return (
    <HookFormTextArea
      placeholder="Take a note..."
      control={control}
      name={scratchPadValues?.id ?? ''}
      defaultValue={scratchPads ?? ''}
      onChange={handleChangeScratchPad}
      className={clsx(
        'sapp-text-area not-resizer h-full w-full rounded-b-xl rounded-t-none px-5 py-3 placeholder:text-sm placeholder:font-normal',
        className,
      )}
    />
  )
}

export default ScratchPatch
