import React, { useMemo, useState } from 'react'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import { formatTime } from '@components/common/timer'
import { ICourseSection } from 'src/type/courses'
import TestModal from 'src/pages/courses/test'
import SappButton from '@components/base/button/SappButton'
import { useRouter } from 'next/router'
import CourseAPI from 'src/pages/api/courses'
import toast from 'react-hot-toast'
import { Tooltip } from 'antd'
import { truncateString } from '@utils/index'

const PartFailed = ({
  coursePart,
  class_user_id,
}: {
  coursePart: ICourseSection
  class_user_id?: string
}) => {
  const formattedTime = coursePart?.quiz?.quiz_timed
    ? formatTime(coursePart?.quiz?.quiz_timed * 60)
    : 'Unlimited'
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const checkFinished = useMemo(() => {
    if (!coursePart?.quiz?.attempts) {
      return false
    }
    if (coursePart?.quiz?.attempts?.length > 0) {
      return true
    }

    return false
  }, [coursePart?.quiz?.attempts])
  const handleChapterTest = async () => {
    try {
      await CourseAPI.learningOutcomeProgress(
        router.query.courseId,
        coursePart.id,
      )
    } catch (err) {
      toast.error('Cannot progress Test')
      throw err
    }
  }
  const quizAttempt = coursePart?.quiz

  return (
    <>
      <div
        className={`name-part text-2xl font-medium h-[60px] line-clamp-2 cursor-default`}
      >
        {(coursePart?.name as string)?.length > 50 ? (
          <Tooltip title={coursePart?.name} color="#ffffff" placement="top">
            {truncateString(coursePart?.name, 50)}
          </Tooltip>
        ) : (
          <>{coursePart?.name}</>
        )}
      </div>
      <div className="info mt-6">
        <div className="time-allow flex justify-between pb-4 border-b border-gray-2">
          <p className="text-base text-gray-1">Time Allowed:</p>
          <p className="text-base text-bw-1 font-semibold">{formattedTime}</p>
        </div>
        <div className="time-allow flex justify-between pt-4">
          <p className="text-base text-gray-1">Attempt:</p>
          <p className="text-base text-bw-1 font-semibold">
            {`${quizAttempt?.attempt_count || 0} / ${
              quizAttempt?.limit_count !== 0
                ? quizAttempt?.limit_count
                : 'Unlimited'
            }` ?? ''}
          </p>
        </div>
      </div>
      <div className="des mt-6">
        <div className={`text-base h-26`} />
      </div>
      <div className="mt-7">
        <div className="action flex items-center jusity-end relative">
          {!checkFinished ? (
            !coursePart?.quiz?.is_limited ||
            coursePart?.quiz?.attempts?.length !==
              coursePart?.quiz?.limit_count ? (
              <ButtonSecondary
                disabled={
                  coursePart?.quiz?.is_limited &&
                  coursePart?.quiz?.attempts?.length ===
                    coursePart?.quiz?.limit_count
                }
                title={`Start`}
                full={false}
                size={'small'}
                className={`${
                  coursePart?.quiz?.attempts?.length !==
                    coursePart?.quiz?.limit_count &&
                  'hover:bg-primary hover:text-white'
                } ml-auto`}
                onClick={() => setOpen(true)}
              />
            ) : (
              <></>
            )
          ) : (
            <div className="flex justify-between flex-1">
              <SappButton
                title="Result"
                isUnderLine
                color="text"
                className="!font-semibold underline !p-0"
                onClick={() =>
                  router.push(
                    `/courses/test/test-result/${quizAttempt?.attempts[0].id}`,
                  )
                }
              ></SappButton>
              <ButtonSecondary
                disabled={
                  coursePart?.quiz?.is_limited &&
                  coursePart?.quiz?.attempt_count ===
                    coursePart?.quiz?.limit_count
                }
                title={'Retake'}
                full={false}
                size={'small'}
                className={`${
                  coursePart?.quiz?.attempt_count !==
                    coursePart?.quiz?.limit_count &&
                  'hover:bg-primary hover:text-white'
                } ml-auto`}
                onClick={() => setOpen(true)}
              />
            </div>
          )}
        </div>
      </div>
      <TestModal
        open={open}
        setOpen={setOpen}
        title={coursePart?.name}
        data={coursePart}
        class_user_id={class_user_id}
        activeCourse={handleChapterTest}
      />
    </>
  )
}

export default PartFailed
