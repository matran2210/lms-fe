interface IProps {
  warning?: boolean;
}
const Warning = ({ warning = false }: IProps) => {
  const warningValue = "DO NOT DIVIDE BY 0! AGAIN, DO NOT DIVIDE BY 0!!!";

  let classList = "warning";
  if (warning) {
    classList = "warning warning--active";
  }

  return (
    <div className={classList}>
      <p>{warningValue}</p>
    </div>
  );
};

export default Warning;
