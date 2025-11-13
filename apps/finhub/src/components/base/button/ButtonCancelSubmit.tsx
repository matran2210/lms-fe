import { IButtonCancelSubmitProps } from 'src/type/v2'
import ButtonPrimary from './ButtonPrimary'
import ButtonText from './ButtonText'

const ButtonCancelSubmit = ({
  submit,
  cancel,
  className = 'flex align-middle justify-between',
  showOkButton = true,
  showCancelButton = true,
  revertFunction = false,
  startIcon,
}: IButtonCancelSubmitProps) => {
  return (
    <div className={className}>
      {showOkButton && (
        <ButtonPrimary {...(!revertFunction ? { ...submit } : { ...cancel })} />
      )}
      {showCancelButton && (
        <ButtonText
          {...(!revertFunction ? { ...cancel } : { ...submit })}
          startIcon={startIcon}
        />
      )}
    </div>
  )
}

export default ButtonCancelSubmit
