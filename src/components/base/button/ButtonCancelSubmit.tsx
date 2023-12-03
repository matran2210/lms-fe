import { IButtonCancelSubmitProps } from 'src/type'
import SappButton from './SappButton'

const ButtonCancelSubmit = ({
  submit,
  cancel,
  className = 'flex align-middle justify-between',
  color = 'primary',
  colorCancel = 'text',
}: IButtonCancelSubmitProps) => {
  return (
    <div className={className}>
      <SappButton color={colorCancel} {...cancel}></SappButton>
      <SappButton color={color} {...submit}></SappButton>
    </div>
  )
}

export default ButtonCancelSubmit
