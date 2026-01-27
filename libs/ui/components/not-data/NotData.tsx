
const NotData = ({ className }: { className?: string | undefined }) => {
  return (
    <div
      className={`${
        className ?? ''
      } d-flex w-full align-content-center justify-content-center text-center`}
    >
      No matching records found
    </div>
  )
}

export default NotData
