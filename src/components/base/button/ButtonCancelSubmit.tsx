import { IButtonCancelSubmitProps } from 'src/type'
import SappButton from './SappButton'

const ButtonCancelSubmit = ({
  submit,
  cancel,
  className = 'flex align-middle justify-between',
  color = 'primary',
  colorCancel = 'text',
  showOkButton = true,
  showCancelButton = true,
  revertFunction = false,
}: IButtonCancelSubmitProps) => {
  return (
    <div className={className}>
      {showCancelButton && (
        <SappButton
          color={colorCancel}
          {...(!revertFunction ? { ...cancel } : { ...submit })}
          isPadding={false}
        ></SappButton>
      )}
      {showOkButton && (
        <SappButton
          color={color}
          {...(!revertFunction ? { ...submit } : { ...cancel })}
        ></SappButton>
      )}
    </div>
  )
}

export default ButtonCancelSubmit
