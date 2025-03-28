import SappDrawer from '@components/base/SappDrawer'
import { useRouter } from 'next/router'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { getUserInformation } from 'src/redux/slice/User/User'
import { useAppDispatch } from 'src/redux/hook'
import { Col, Collapse, Row } from 'antd'
const { Panel } = Collapse

export interface IProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  reloadPage: () => void
}

function FormViewProgress({ open, setOpen, reloadPage }: IProps) {
  const router = useRouter()
  const params = router.query?.id
  const isEdit = false
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)

  const loadData = async () => {}

  useLayoutEffect(() => {
    loadData()
  }, [params])

  useEffect(() => {
    dispatch(getUserInformation())
  }, [])

  return (
    <SappDrawer
      isOpen={open}
      message="Bạn có chắc chán muốn hủy không?"
      onClose={() => setOpen(false)}
      title={'View Detail'}
      footer={false}
      confirmOnClose={true}
      sizeTextBtn="medium"
      heightBody={'h-[calc(100vh-146px)]'}
    >
      <Collapse defaultActiveKey={['1']}>
        <Panel header="View Detail" key="1">
          <div>
            <Row>
              <Col md={8} className="sapp-color-gray-role mb-5">
                Lesson
              </Col>
              <Col md={16} className="mb-5">
                18:00 - 21:00
              </Col>
            </Row>
            <Row>
              <Col md={8} className="sapp-color-gray-role mb-5">
                Section
              </Col>
              <Col md={16} className="mb-5">
                Financial Statement Analysis
              </Col>
            </Row>
            <Row>
              <Col md={8} className="sapp-color-gray-role mb-5">
                Time
              </Col>
              <Col md={16} className="mb-5">
                18:00 - 21:00
              </Col>
            </Row>
            <Row>
              <Col md={8} className="sapp-color-gray-role mb-5">
                Progress
              </Col>
              <Col md={16} className="mb-5">
                90%
              </Col>
            </Row>
            <Row>
              <Col md={8} className="sapp-color-gray-role mb-5">
                Teacher
              </Col>
              <Col md={16} className="mb-5">
                Nguyễn Hải Phong
              </Col>
            </Row>
            <Row>
              <Col md={8} className="sapp-color-gray-role mb-5">
                Creator
              </Col>
              <Col md={16} className="mb-5">
                Le Mai
              </Col>
            </Row>
            <Row>
              <Col md={8} className="sapp-color-gray-role mb-5">
                Create Date
              </Col>
              <Col md={16} className="mb-5">
                12/02/2025 | 19:30
              </Col>
            </Row>
            <Row>
              <Col md={8} className="sapp-color-gray-role mb-5">
                Note
              </Col>
              <Col md={16} className="mb-5"></Col>
            </Row>
          </div>
        </Panel>
      </Collapse>

      <Collapse defaultActiveKey={['1']} className="mt-5">
        <Panel header="Content Completed" key="1">
          <div></div>
        </Panel>
      </Collapse>
    </SappDrawer>
  )
}

export default FormViewProgress
