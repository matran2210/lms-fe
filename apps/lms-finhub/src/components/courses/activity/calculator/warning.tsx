interface IProps {
  warning?: boolean
}
const Warning = (props: IProps) => {
  const { warning } = props
  const warningValue = 'DO NOT DIVIDE BY 0! AGAIN, DO NOT DIVIDE BY 0!!!'

  let classList = 'warning'
  if (warning) {
    classList = 'warning warning--active'
  }

  return (
    <div className={classList}>
      <i className="fas fa-radiation" />
      <p>{warningValue}</p>
    </div>
  )
}

Warning.defaultProps = {
  warning: false,
}

export default Warning
