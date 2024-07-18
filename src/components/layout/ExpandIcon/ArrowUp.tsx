type Props = {
  className: string
}

function ArrowUp({ className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="800"
      height="800"
      fill="currentColor"
      version="1.1"
      viewBox="0 0 330 330"
      xmlSpace="preserve"
      className={`w-3 h-3 ml-4 ${className}`}
    >
      <path d="M325.606 229.393l-150.004-150a14.997 14.997 0 00-21.213.001l-149.996 150c-5.858 5.858-5.858 15.355 0 21.213 5.857 5.857 15.355 5.858 21.213 0l139.39-139.393 139.397 139.393A14.953 14.953 0 00315 255a14.95 14.95 0 0010.607-4.394c5.857-5.858 5.857-15.355-.001-21.213z"></path>
    </svg>
  )
}

export default ArrowUp
