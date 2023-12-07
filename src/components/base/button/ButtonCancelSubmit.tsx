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
}: IButtonCancelSubmitProps) => {
  return (
    <div className={className}>
      {showCancelButton && (
        <SappButton color={colorCancel} {...cancel}></SappButton>
      )}
      {showOkButton && <SappButton color={color} {...submit}></SappButton>}
    </div>
  )
}

export default ButtonCancelSubmit
