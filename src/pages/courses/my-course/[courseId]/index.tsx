import Filter from '@components/mycourses/Filter'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import BreadcrumbFilter from '@components/mycourses/course-detail/BreadcrumbFilter'
import CourseParts from '@components/mycourses/course-detail/CourseParts'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import CourseAPI from 'src/pages/api/courses'
import { apiURL } from 'src/redux/services/httpService'
import { ICourseDetailAll } from 'src/type/courses'

const DEFAULT_PAGESIZE = 18

const fetchData = async (id: string | string[] | undefined, page: number, pageSize: number, token: string) => {
  const apiResponse = await axios.get(`${apiURL}/courses/${id}?page_index=${page}&page_size=${pageSize}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return apiResponse?.data?.data
};

const CourseDetail = ({ courses }: { courses: ICourseDetailAll }) => {
  const [data, setData] = useState<any>(courses?.data?.course_sections_with_progress || []);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const newData = await CourseAPI.getCourseDetail(router.query.courseId, page + 1, DEFAULT_PAGESIZE); // Increase pageSize by 3
      setData([...data, ...newData?.data?.data?.course_sections_with_progress]);
      setPage(page + 1);
    } catch (error) {} finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  return (
    <>
      <div className="header bg-white border-b border-default">
        <div className="max-w-xxl my-0 mx-auto flex py-[23px] xl-max:mx-5">
          <SearchForm
            placeholder="Enter name of part..."
            formStyle="w-full flex items-center"
          />
        </div>
      </div>
      <div className="main max-w-xxl my-0 mx-auto xl-max:container">
        <div className="flex justify-between py-6">
          <BreadcrumbFilter name={courses?.data?.name} />
          <Filter
            totalResult={courses?.data?.course_sections_with_progress?.length}
          />
        </div>
      </div>
      <div className="heading bg-white max-w-xxl my-0 mx-auto flex xl-max:mx-6">
        <Heading greeting="Welcome to" title={courses?.data?.name} />
      </div>
      <div className="pt-6 max-w-xxl my-0 mx-auto xl-max:container">
        <CourseParts courses={courses?.data?.course_sections_with_progress} />
      </div>
    </>
  )
}

export default CourseDetail

export async function getServerSideProps(context: any) {
  const { req, res, query } = context
  const accessToken = req.cookies.accessToken

  try {
    const courses = await fetchData(query.courseId, 1, DEFAULT_PAGESIZE, accessToken);

    return {
      props: {
        courses: courses || {},
      },
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
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

        res.setHeader(
          'Set-Cookie',
          `accessToken=${refreshResponse.data.accessToken}; HttpOnly`,
        )

        const courses = await fetchData(query.courseId, 1, DEFAULT_PAGESIZE, refreshResponse.data.accessToken);

        return {
          props: {
            courses: courses || {},
          },
        }
      } catch (refreshError) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }
    } else {
    }
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}
