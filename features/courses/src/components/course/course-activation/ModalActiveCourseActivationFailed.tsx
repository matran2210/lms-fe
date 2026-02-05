import { SadFaceIcon } from "@lms/assets/icons/course/CourseContent";
import { SappModalV3 } from "@lms/ui";

const REDIRECT_URL = "https://sapp.edu.vn/dich-vu-cham-soc-hoc-vien-sapp-academy/"
const SupportFooter = () => (
  <>
    <br />
    For further assistance, please contact our support team through the
    following channels.
    <br />
    Service Request Form:{" "}
    <a
      href= {REDIRECT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold underline text-black hover:text-primary"
    >
      Click here
    </a>
    <br />
    Hotline: <span className="font-semibold">1900 2225 – Ext. 2 </span>
    (Emergency)
  </>
)

const ModalActiveCourseActivationFailed = ({
  open,
  onCancel,
  error,
}: {
  open: boolean
  onCancel: () => void
  error?: string
}) => {
  return (
    <SappModalV3
      handleClose={onCancel}
      width={560}
      open={open}
      cancelButtonCaption="Quit"
      okButtonCaption="Service Request Form"
      showCancelButton={false}
      handleCancel={onCancel}
      onOk={() => window.location.href = REDIRECT_URL}
      fullWidthBtn
      buttonSize="medium"
      icon={<SadFaceIcon />}
      header="Oops!"
      content={
        error ? (
          <p className="text-center text-sm leading-relaxed text-gray-700">
            {error}
            <SupportFooter />
          </p>
        ) : null
      }
      isMaskClosable={false}
    />
  )
}

export default ModalActiveCourseActivationFailed
