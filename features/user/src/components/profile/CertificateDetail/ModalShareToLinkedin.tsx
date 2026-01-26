import { ButtonPrimary } from "@lms/ui";
import { HookFormCheckBox } from "@lms/ui";
import { SappModalV3 } from "@lms/ui";
import { HookFormTextAreaV2 } from "@lms/ui";
import { ICertificate } from "@lms/core";
import { openLinkedInPopup } from "@lms/utils";
import { Image } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useFeature } from "@lms/contexts";
import { useDownloadImage } from "@lms/hooks";

interface IProps {
  open: boolean;
  onClose: () => void;
  certificate?: ICertificate;
}
interface IForm {
  shareToFeed: boolean;
  addToProfile: boolean;
  text?: string;
}
const ModalShareToLinkedin = ({ open, onClose, certificate }: IProps) => {
  const { certificateApi } = useFeature();
  const [loading, setLoading] = useState(false);
  const certId = certificate?.id || "";
  const certURL = certificate?.certificate_url || `${process.env.NEXT_PUBLIC_WEB_LMS_URL}/certificates/${certificate?.id}`;
  const shareUrl = encodeURIComponent(certURL);
  const SAPP_LINKEDIN_ID = 15236709;
  const linkedInUrl =
    `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME` +
    `&name=${encodeURIComponent(certificate?.course.name || "")}` +
    `&organizationId=${SAPP_LINKEDIN_ID}` +
    // `&organizationName=${encodeURIComponent('SAPP Academy')}` +
    `&issueYear=${dayjs().year()}` +
    `&issueMonth=${dayjs().month() + 1}` +
    `&certUrl=${encodeURIComponent(certURL)}` +
    `&certId=${encodeURIComponent(certificate?.id || "")}`;
  const form = useForm<IForm>({
    defaultValues: {
      shareToFeed: true,
      addToProfile: true,
    },
  });
  const isShareToFeed = form.watch("shareToFeed");
  const onResetForm = () => {
    form.reset({
      shareToFeed: true,
      addToProfile: true,
    });
  };

  const handleClose = () => {
    onResetForm();
    onClose();
  };
   const { getCertificateBase64 } = useDownloadImage();
    const handleCovertBase64ToBuffer = async () => {
      if (loading) return;
      try {
        const base64Data = await getCertificateBase64(
          document.getElementById(`vertical-${certificate?.id}`) as HTMLElement, 
          certificate?.certificate?.html_template as string, 
          certificate?.user.detail.full_name || '', 
          certificate?.certificate?.name || ''
        );

        const pureBase64 = base64Data!.url.replace(/^data:image\/\w+;base64,/, "");
        return pureBase64

      } catch (error) {
      } finally {
      }
    }
  const handleShareToFeed = async (data: IForm, callback?: () => void) => {
    const token = sessionStorage.getItem("linkedin_access_token");
    const personURN = sessionStorage.getItem("urn");

    const bufferImage = await handleCovertBase64ToBuffer();
    if (!token || !personURN) {
      // Chưa có token → mở popup login LinkedIn
      const popup = window.open(
        `/api/auth/linkedin?popup=true&shareUrl=${encodeURIComponent(shareUrl)}&certId=${encodeURIComponent(certId)}`,
        "LinkedInPopup",
        "width=600,height=600",
      );

      // Lắng nghe message từ popup khi login xong
      window.addEventListener("message", async (event) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === "LINKEDIN_TOKEN") {
          sessionStorage.setItem("linkedin_access_token", event.data.token);
          sessionStorage.setItem("urn", event.data.personURN);

          popup?.close();
          const personURN = event.data.personURN;
          if (!personURN) {
            toast.error("Không lấy được URN");
            return;
          }
          setLoading(true);
          // Gọi luôn hàm upload sau khi login
          const res = await certificateApi.uploadImageToLinkedIn(
            event.data.token,
            personURN,
            shareUrl,
            data.text || "",
            bufferImage!
          );
          setLoading(false);
          if (res && res?.data?.success) {
            toast.success(res?.data?.message);
            callback?.(); // Gọi callback để đóng modal sau khi upload thành công
            handleClose();
          } else {
            callback?.(); // Gọi callback để đóng modal sau khi upload thành công
            toast.error(res?.data?.message);
          }
        }
      });
    } else {
      // Có sẵn token rồi → gọi upload luôn
      const personURN = sessionStorage.getItem("urn");
      if (!personURN) {
        toast.error("Không lấy được URN");
        return;
      }
      setLoading(true)
      const res = await certificateApi.uploadImageToLinkedIn(
        token,
        personURN,
        shareUrl,
        data.text || "",
        bufferImage!
      );
      setLoading(false);
      if (res && res?.data?.success) {
        toast.success(res?.data?.message);
        callback?.(); // Gọi callback để đóng modal sau khi upload thành công
        handleClose();
      } else {
        callback?.(); // Gọi callback để đóng modal sau khi upload thành công
        toast.error(res?.data?.message);
      }
    }
  };

  const onSubmit = async (data: IForm) => {


    if (data.addToProfile && data.shareToFeed) {
      handleShareToFeed(data, () =>
        openLinkedInPopup(linkedInUrl, handleClose),
      );
      return;
    }
    // share to feed
    if (data.shareToFeed && !data.addToProfile) {
      handleShareToFeed(data);
      return;
    }
    if (data.addToProfile && !data.shareToFeed) {
      // add to profile
      openLinkedInPopup(linkedInUrl, handleClose);
      handleClose();
      return;
    }
  };

  return (
    <SappModalV3
      handleClose={() => handleClose()}
      open={open}
      onOk={() => {}}
      handleCancel={handleClose}
      isClosable
      showFooter={false}
    >
      <div className="flex flex-col items-center gap-10">
        <div className="text-3xl font-bold">Share with Linkedin</div>
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-3">
            <HookFormCheckBox
              control={form.control}
              name="shareToFeed"
              title="Linkedin Post"
              classNameTitle="text-gray-800 font-semibold"
            />
            {isShareToFeed && (
              <div className="flex items-center gap-5 rounded-lg border border-gray-300 p-4">
                {certificate?.certificate_url && (
                  <Image
                    src={certURL}
                    alt={certificate?.course.name}
                    className="max-h-[125px] max-w-[80px] object-contain"
                    //   width={80}
                    //   height={125}
                  />
                )}
                <HookFormTextAreaV2
                  className="h-full flex-1"
                  control={form.control}
                  variant="borderless"
                  name="text"
                  placeholder="Say something about this..."
                  autoSize={{ minRows: 2, maxRows: 6 }}
                />
              </div>
            )}
          </div>
          <div>
            <HookFormCheckBox
              control={form.control}
              name="addToProfile"
              title="Linkedin Licenses & certifications"
              classNameTitle="text-gray-800 font-semibold"
            />
          </div>
        </div>
        <div className="w-full">
          <ButtonPrimary
            loading={loading}
            full
            size="medium"
            onClick={form.handleSubmit(onSubmit)}
          >
            Share to Linkedin
          </ButtonPrimary>
        </div>
      </div>
    </SappModalV3>
  );
};

export default ModalShareToLinkedin;
