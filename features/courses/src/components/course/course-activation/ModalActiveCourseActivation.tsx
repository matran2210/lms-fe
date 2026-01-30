import { SadFaceIcon } from "@lms/assets/icons/course/CourseContent";
import { SappModalV3 } from "@lms/ui";

const ModalActiveCourseActivation = ({
  open,
  onCancel,
}: {
  open: {courseId: string; open: boolean};
  onCancel: () => void;
}) => {
  const okButtonCaption = "Service Request Form";
  const onSubmit = () => {};
  const content1 = (
    <p className="text-center text-sm leading-relaxed text-gray-700">
      You cannot activate the course you have enrolled in.
      <br />
      For further assistance, please contact our support team through the
      following channels. Service Request Form:
      <a
        href="#"
        className="font-semibold underline text-black hover:text-primary"
      >
        Click here
      </a>
      <br />
      Hotline: <span className="font-semibold">1900 2225 – Ext. 2 </span>{" "}
      (Emergency)
    </p>
  );

  const content2 = (
    <p className="text-center text-sm leading-relaxed text-gray-700">
      There are no available classes currently running or scheduled soon for
      this course.
      <br />
      For further assistance, please contact our support team through the
      following channels. Service Request Form:
      <a
        href="#"
        className="font-semibold underline text-black hover:text-primary"
      >
        Click here
      </a>
      <br />
      Hotline: <span className="font-semibold">1900 2225 – Ext. 2 </span>{" "}
      (Emergency)
    </p>
  );

  const content3 = (
    <p className="text-center text-sm leading-relaxed text-gray-700">
      You need to complete{" "}
      <span className="font-semibold text-black">
        F3 - Financial Accounting
      </span>{" "}
      before activating{" "}
      <span className="font-semibold text-black">F7 - Financial Reporting</span>{" "}
      or{" "}
      <span className="font-semibold text-black">F8 - Audit and Assurance</span>
      , as the knowledge from{" "}
      <span className="font-semibold text-black">F3</span> is required for both
      F7 and F8.
      <br />
      For further assistance, please contact our support team through the
      following channels. Service Request Form:{" "}
      <a
        href="#"
        className="font-semibold underline text-black hover:text-primary"
      >
        Click here
      </a>
      <br />
      Hotline: <span className="font-semibold">1900 2225 – Ext. 2 </span>{" "}
      (Emergency)
    </p>
  );

  const content4 = (
    <p className="text-center text-sm leading-relaxed text-gray-700">
      You need to complete{" "}
      <span className="font-semibold text-black">
        F2 - Management Accounting
      </span>{" "}
      before activating{" "}
      <span className="font-semibold text-black">
        {" "}
        F5 - Performance Management
      </span>{" "}
      , as the knowledge from{" "}
      <span className="font-semibold text-black">F2</span> is required for F5.
      <br />
      For further assistance, please contact our support team through the
      following channels. Service Request Form:{" "}
      <a
        href="#"
        className="font-semibold underline text-black hover:text-primary"
      >
        Click here
      </a>
      <br />
      Hotline: <span className="font-semibold">1900 2225 – Ext. 2 </span>{" "}
      (Emergency)
    </p>
  );

  const content6 = (
    <p className="text-center text-sm leading-relaxed text-gray-700">
      Your enrollment in class{" "}
      <span className="font-semibold text-black">&lt;Class Code&gt;</span> could
      not be completed due to{" "}
      <span className="font-semibold text-black">&lt;Reason&gt;</span>.
      <br />
      For further assistance, please contact our support team through the
      following channels. Service Request Form:{" "}
      <a
        href="#"
        className="font-semibold underline text-black hover:text-primary"
      >
        Click here
      </a>
      <br />
      Hotline: <span className="font-semibold">1900 2225 – Ext. 2 </span>
      (Emergency)
    </p>
  );

  const content7 = (
    <p className="text-center text-sm leading-relaxed text-gray-700">
      You need to complete all{" "}
      <span className="font-semibold text-black">F-level courses</span> before
      activating <span className="font-semibold text-black">P-level ones</span>{" "}
      , as the knowledge from{" "}
      <span className="font-semibold text-black">F-level</span> is required for{" "}
      <span className="font-semibold text-black"> P-level</span>.
      <br />
      For further assistance, please contact our support team through the
      following channels. Service Request Form:{" "}
      <a
        href="#"
        className="font-semibold underline text-black hover:text-primary"
      >
        Click here
      </a>
      <br />
      Hotline: <span className="font-semibold">1900 2225 – Ext. 2 </span>{" "}
      (Emergency)
    </p>
  );

  return (
    <SappModalV3
      width={560}
      open={open?.open}
      cancelButtonCaption="Quit"
      okButtonCaption={okButtonCaption}
      showCancelButton={false}
      handleCancel={onCancel}
      onOk={onSubmit}
      fullWidthBtn={true}
      buttonSize="medium"
      icon={<SadFaceIcon />}
      header={"Oops!"}
      content={content6}
      isMaskClosable={false}
    />
  );
};
export default ModalActiveCourseActivation;
