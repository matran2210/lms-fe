import Layout from '@components/layout/Teacher'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import { TeacherAPI } from 'src/pages/api/teacher/index'
import ClassCard from '@components/card/ClassCard'

const DEFAULT_PAGESIZE = 10
const MyClassById = () => {
  const router = useRouter()
  const getClassById = async () => {
    const res = await TeacherAPI.getClassById(
      'c74237ce-cc06-4b6b-ac6a-3fddb6e3095c',
    )
  }

  useEffect(() => {
    getClassById()
  }, [])

  return (
    <SappLoadingGlobal loading={false}>
      <Layout title="My Class">
        <ClassCard
          tabs={[
            { title: 'Overview', link: '/teacher/my-class/overview' },
            { title: 'Students', link: '/teacher/my-class/students' },
            {
              title: 'Teaching Progress',
              link: '/teacher/my-class/teaching-progress',
            },
            {
              title: 'Students Test Result',
              link: '/teacher/my-class/students-test-result',
            },
          ]}
        />
      </Layout>
    </SappLoadingGlobal>
  )
}

export default MyClassById
