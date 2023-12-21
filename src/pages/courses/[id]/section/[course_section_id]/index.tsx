import React, { useEffect, useState } from 'react'
import PreviewPartDetail from 'preview-part'
import 'preview-part/dist/index.css'
import { TreeHelper } from 'src/helper/tree'
import CourseAPI from 'src/pages/api/courses'
import { ILearningOutcome } from 'src/type/courses'
import SappDrawer from '@components/base/SappDrawer'
import axios from 'axios'
import { apiURL } from 'src/redux/services/httpService'
import { useRouter } from 'next/router'

const CoursePartDetail = ({ previewPart }: any) => {
  const [chapterDetail, setChapterDetail] = useState<any>(null)
  const [loadingChapter, setLoadingChapter] = useState(false)
  const [openLearningOutcome, setOpenLearningOutcome] = useState(false)
  const [learningOutcome, setLearningOutcome] = useState<ILearningOutcome>()
  const router = useRouter()

  const tree = TreeHelper.convertFromArray(previewPart?.course_section_tree)
  const partDetail = tree[0] as any

  const fetchChapterDetail = async (
    id: string | undefined,
    course_section_id: string | undefined,
  ) => {
    setLoadingChapter(true)
    try {
      const res = await CourseAPI.getCoursePartDetail(id, course_section_id)
      const nodeList = res?.data?.course_section_tree
      const tree = TreeHelper.convertFromArray(nodeList)
      const detail = tree[0]
      setChapterDetail(detail)
    } catch (error) {
    } finally {
      setLoadingChapter(false)
    }
  }

  const handleCancel = () => {
    setOpenLearningOutcome(false)
    document.body.style.overflow = 'auto'
  }

  async function getLearningOutcome() {
    try {
      const res = await CourseAPI.getCourseLearningOutcome(
        chapterDetail?.course_learning_outcome?.id,
      )
      setLearningOutcome(res?.data)
    } catch (error) {}
  }

  useEffect(() => {
    if (openLearningOutcome) {
      getLearningOutcome()
    }
  }, [openLearningOutcome])

  const handleRouterActivity = (id: string) => {
    router.push(`/courses/${router.query.id}/activity/${id}`)
  }

  return (
    <div className="main max-w-xxl my-0 mx-auto">
      <div className="main max-w-xxl my-0 mx-auto">
        <div className="flex pt-6 pb-1 items-center">
          <p
            onClick={() => router.push('/courses')}
            className="text-medium-sm font-semibold text-gray-1 cursor-pointer"
          >
            My Course
          </p>
          <p
            className="text-medium-sm font-semibold text-gray-1 ms-1 cursor-pointer"
            onClick={() => router.push(`/courses/my-course/${router.query.id}`)}
          >
            / {previewPart?.name} /
          </p>
          <p className="text-medium-sm font-semibold text-bw-1 ms-1">
            {partDetail?.name}
          </p>
        </div>
      </div>
      <PreviewPartDetail
        chapterMenu={partDetail}
        fetchChapterDetail={fetchChapterDetail}
        chapterDetail={chapterDetail}
        loading={false}
        loadingChapter={loadingChapter}
        setLoadingChapter={setLoadingChapter}
        setOpenLearningOutcome={setOpenLearningOutcome}
        course_id={router.query.id as any}
        course_section_id={router.query.course_section_id as any}
        handleRouterActivity={handleRouterActivity}
      />

      <SappDrawer
        isOpen={openLearningOutcome}
        onClose={handleCancel}
        title={learningOutcome?.name}
        message="Bạn có chắc chắn muốn hủy không?"
        widthDrawer="w-6/12"
      >
        <div
          style={{ borderBottom: '1px solid #DCDDDD' }}
          className="pb-6"
          dangerouslySetInnerHTML={{
            __html: learningOutcome?.description ?? '',
          }}
        />
        {learningOutcome?.course_outcomes?.map((outcome, index) => (
          <div className="flex mt-6]" key={outcome.id}>
            <div className="font-semibold leading-6 text-sm me-1">
              LO{index + 1}:
            </div>
            <p
              className="text-sm font-normal leading-6 text-bw-1"
              dangerouslySetInnerHTML={{ __html: outcome?.description }}
            />
          </div>
        ))}
      </SappDrawer>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  const { req, res, query } = context

  // Lấy accessToken từ cookie
  const accessToken = req.cookies.accessToken

  try {
    // Thực hiện yêu cầu API với accessToken
    const apiResponse = await axios.get(
      `${apiURL}/course-sections/${query.id}?course_section_id=${query.course_section_id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    // Xử lý dữ liệu từ API
    const nodeList = apiResponse?.data?.data
    // const tree = TreeHelper.convertFromArray(nodeList)
    // const previewPart = tree[0]

    // Trả về props cho trang
    return {
      props: {
        previewPart: nodeList || null,
      },
    }
  } catch (error: any) {
    // Nếu có lỗi khi sử dụng accessToken, kiểm tra xem có phải là lỗi hết hạn không
    if (error.response && error.response.status === 401) {
      // Nếu là lỗi hết hạn, thực hiện cập nhật accessToken
      const refreshToken = req.cookies.refreshToken

      try {
        const refreshResponse = await axios.post(
          `${apiURL}/auth/rotate`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        )

        // Lưu accessToken mới vào cookie
        res.setHeader(
          'Set-Cookie',
          `accessToken=${refreshResponse.data.accessToken}; HttpOnly`,
        )

        // Tiếp tục thực hiện yêu cầu API với accessToken mới
        const newApiResponse = await axios.get(
          `${apiURL}/course-sections/${query.id}`,
          {
            headers: {
              Authorization: `Bearer ${refreshResponse.data.accessToken}`,
            },
          },
        )

        // Xử lý dữ liệu từ API
        const nodeList = newApiResponse?.data?.data
        // const tree = TreeHelper.convertFromArray(nodeList)
        // const previewPart = tree[0]

        // Trả về props cho trang
        return {
          props: {
            previewPart: nodeList || {},
          },
        }
      } catch (refreshError) {
        // Chuyển hướng đến trang đăng nhập
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }
    } else {
      // Chuyển hướng đến trang đăng nhập
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }
  }
}

export default CoursePartDetail
