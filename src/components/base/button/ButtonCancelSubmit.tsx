import { IButtonCancelSubmitProps } from 'src/type'
import SappButton from './SappButton'

const ButtonCancelSubmit = ({
  submit,
  cancel,
  className = 'flex align-middle justify-between',
  color,
  colorCancel = 'text',
  showOkButton = true,
  showCancelButton = true,
  revertFunction = false,
}: IButtonCancelSubmitProps) => {
  return (
    <div className={className}>
      {showOkButton && (
        <SappButton
          color={color}
          {...(!revertFunction ? { ...submit } : { ...cancel })}
        />
      )}
      {showCancelButton && (
        <SappButton
          color={colorCancel}
          {...(!revertFunction ? { ...cancel } : { ...submit })}
        />
      )}
    </div>
  )
}

export default ButtonCancelSubmit
