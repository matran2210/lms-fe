import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
import HookFormCheckBox from '@components/base/checkbox/HookFormCheckBox'
import HookFormCheckBoxGroup from '@components/base/checkbox/HookFormCheckBoxGroup'
import PaginationSAPP from '@components/base/pagination/PaginationSAPP'
import { formatTime } from '@components/common/timer'
import OneChoiceQuestion from '@components/questionType/OneChoiceQuestion'
import { LAYOUT } from '@utils/constants'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { DISPLAY_TYPE, QUESTION_TYPES } from 'src/constants'
const Test = () => {
  const [currentPage, setCurrentPage] = useState<any>(1)
  const { control, handleSubmit } = useForm()
  const { control: controlAnswer } = useForm()
  const OptionShowAll = () => {
    return (
      <div className="w-max">
        <HookFormCheckBoxGroup
          control={control}
          name={'filter'}
          options={[
            { label: 'Unattempted', value: 'unattempted' },
            { label: 'Attempted', value: 'attempted' },
            { label: 'Flag to Review', value: 'flag' },
          ]}
        />
      </div>
    )
  }
  const data = {
    id: '260b9ac9-a0ce-42eb-bf3f-38e0fdb83ead',
    created_at: '2023-11-20T04:35:42.394Z',
    updated_at: '2023-11-20T04:35:42.394Z',
    deleted_at: null,
    key: 'QN000489',
    question_filter_id: null,
    question_topic_id: '721625a5-0c8b-4fe8-a88b-932782386a6c',
    question_content: '<p>heelo 1 choise&nbsp;</p>',
    level: 'ADVANCED',
    qType: 'ONE_CHOICE',
    assignment_type: 'TEXT',
    response_option: null,
    question_files: null,
    display_type: 'VERTICAL',
    solution: '<p>32q3</p>',
    status: 'PUBLISH',
    hint: '',
    files: [],
    answers: [
      {
        id: '748aeeb6-d3a6-4e7e-b5ab-da53ec52eb11',
        created_at: '2023-11-20T04:35:42.394Z',
        updated_at: '2023-11-20T04:35:42.394Z',
        deleted_at: null,
        question_id: '260b9ac9-a0ce-42eb-bf3f-38e0fdb83ead',
        answer: '1',
        is_correct: false,
        feedback: null,
        active: null,
        answer_position: 1,
      },
      {
        id: 'f031b23b-d006-4c57-b157-c6973493b69e',
        created_at: '2023-11-20T04:35:42.394Z',
        updated_at: '2023-11-20T04:35:42.394Z',
        deleted_at: null,
        question_id: '260b9ac9-a0ce-42eb-bf3f-38e0fdb83ead',
        answer: '22',
        is_correct: true,
        feedback: null,
        active: null,
        answer_position: 2,
      },
    ],
    question_filter: null,
    exhibits: [],
    requirements: [],
    question_matchings: [],
    tags: [],
  } as any
  const topicDescription =
    '<p><video width="300" height="150" poster="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/thumbnails/thumbnail.jpg" id="c13d87be-b6e7-46e5-9dde-db5fa983c6b6" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848">\n        <source src="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/manifest/video.m3u8" id="124f7da6-09a3-4d8a-887f-0689e6a3bda0" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848" resource_status="READY_TO_STREAM">\n      </video>Topic Name</p>\n<p><img id="9b9cd785-047b-4380-9ba0-d1ef164d6084" resource_id="fe119bdc-c5db-49fa-ba0b-00ebbec6d121" title="buon-anh-meo-khoc-cute.jpg" src="https://cdn-dev.sapp.edu.vn/topic/1700217686841_buon-anh-meo-khoc-cute.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&amp;X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20231117%2Fap-southeast-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20231117T104127Z&amp;X-Amz-Expires=3600&amp;X-Amz-Signature=e65393371bd23625716d04155c5a72f12c95852c04043be776cda897c906db5e&amp;X-Amz-SignedHeaders=host&amp;x-id=GetObject" width="200"></p><p><video width="300" height="150" poster="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/thumbnails/thumbnail.jpg" id="c13d87be-b6e7-46e5-9dde-db5fa983c6b6" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848">\n        <source src="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/manifest/video.m3u8" id="124f7da6-09a3-4d8a-887f-0689e6a3bda0" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848" resource_status="READY_TO_STREAM">\n      </video>Topic Name</p>\n<p><img id="9b9cd785-047b-4380-9ba0-d1ef164d6084" resource_id="fe119bdc-c5db-49fa-ba0b-00ebbec6d121" title="buon-anh-meo-khoc-cute.jpg" src="https://cdn-dev.sapp.edu.vn/topic/1700217686841_buon-anh-meo-khoc-cute.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&amp;X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20231117%2Fap-southeast-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20231117T104127Z&amp;X-Amz-Expires=3600&amp;X-Amz-Signature=e65393371bd23625716d04155c5a72f12c95852c04043be776cda897c906db5e&amp;X-Amz-SignedHeaders=host&amp;x-id=GetObject" width="200"></p><p><video width="300" height="150" poster="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/thumbnails/thumbnail.jpg" id="c13d87be-b6e7-46e5-9dde-db5fa983c6b6" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848">\n        <source src="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/manifest/video.m3u8" id="124f7da6-09a3-4d8a-887f-0689e6a3bda0" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848" resource_status="READY_TO_STREAM">\n      </video>Topic Name</p>\n<p><img id="9b9cd785-047b-4380-9ba0-d1ef164d6084" resource_id="fe119bdc-c5db-49fa-ba0b-00ebbec6d121" title="buon-anh-meo-khoc-cute.jpg" src="https://cdn-dev.sapp.edu.vn/topic/1700217686841_buon-anh-meo-khoc-cute.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&amp;X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20231117%2Fap-southeast-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20231117T104127Z&amp;X-Amz-Expires=3600&amp;X-Amz-Signature=e65393371bd23625716d04155c5a72f12c95852c04043be776cda897c906db5e&amp;X-Amz-SignedHeaders=host&amp;x-id=GetObject" width="200"></p><p><video width="300" height="150" poster="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/thumbnails/thumbnail.jpg" id="c13d87be-b6e7-46e5-9dde-db5fa983c6b6" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848">\n        <source src="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/manifest/video.m3u8" id="124f7da6-09a3-4d8a-887f-0689e6a3bda0" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848" resource_status="READY_TO_STREAM">\n      </video>Topic Name</p>\n<p><img id="9b9cd785-047b-4380-9ba0-d1ef164d6084" resource_id="fe119bdc-c5db-49fa-ba0b-00ebbec6d121" title="buon-anh-meo-khoc-cute.jpg" src="https://cdn-dev.sapp.edu.vn/topic/1700217686841_buon-anh-meo-khoc-cute.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&amp;X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20231117%2Fap-southeast-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20231117T104127Z&amp;X-Amz-Expires=3600&amp;X-Amz-Signature=e65393371bd23625716d04155c5a72f12c95852c04043be776cda897c906db5e&amp;X-Amz-SignedHeaders=host&amp;x-id=GetObject" width="200"></p><p><video width="300" height="150" poster="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/thumbnails/thumbnail.jpg" id="c13d87be-b6e7-46e5-9dde-db5fa983c6b6" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848">\n        <source src="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/manifest/video.m3u8" id="124f7da6-09a3-4d8a-887f-0689e6a3bda0" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848" resource_status="READY_TO_STREAM">\n      </video>Topic Name</p>\n<p><img id="9b9cd785-047b-4380-9ba0-d1ef164d6084" resource_id="fe119bdc-c5db-49fa-ba0b-00ebbec6d121" title="buon-anh-meo-khoc-cute.jpg" src="https://cdn-dev.sapp.edu.vn/topic/1700217686841_buon-anh-meo-khoc-cute.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&amp;X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20231117%2Fap-southeast-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20231117T104127Z&amp;X-Amz-Expires=3600&amp;X-Amz-Signature=e65393371bd23625716d04155c5a72f12c95852c04043be776cda897c906db5e&amp;X-Amz-SignedHeaders=host&amp;x-id=GetObject" width="200"></p><p><video width="300" height="150" poster="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/thumbnails/thumbnail.jpg" id="c13d87be-b6e7-46e5-9dde-db5fa983c6b6" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848">\n        <source src="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/manifest/video.m3u8" id="124f7da6-09a3-4d8a-887f-0689e6a3bda0" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848" resource_status="READY_TO_STREAM">\n      </video>Topic Name</p>\n<p><img id="9b9cd785-047b-4380-9ba0-d1ef164d6084" resource_id="fe119bdc-c5db-49fa-ba0b-00ebbec6d121" title="buon-anh-meo-khoc-cute.jpg" src="https://cdn-dev.sapp.edu.vn/topic/1700217686841_buon-anh-meo-khoc-cute.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&amp;X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20231117%2Fap-southeast-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20231117T104127Z&amp;X-Amz-Expires=3600&amp;X-Amz-Signature=e65393371bd23625716d04155c5a72f12c95852c04043be776cda897c906db5e&amp;X-Amz-SignedHeaders=host&amp;x-id=GetObject" width="200"></p><p><video width="300" height="150" poster="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/thumbnails/thumbnail.jpg" id="c13d87be-b6e7-46e5-9dde-db5fa983c6b6" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848">\n        <source src="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/manifest/video.m3u8" id="124f7da6-09a3-4d8a-887f-0689e6a3bda0" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848" resource_status="READY_TO_STREAM">\n      </video>Topic Name</p>\n<p><img id="9b9cd785-047b-4380-9ba0-d1ef164d6084" resource_id="fe119bdc-c5db-49fa-ba0b-00ebbec6d121" title="buon-anh-meo-khoc-cute.jpg" src="https://cdn-dev.sapp.edu.vn/topic/1700217686841_buon-anh-meo-khoc-cute.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&amp;X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20231117%2Fap-southeast-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20231117T104127Z&amp;X-Amz-Expires=3600&amp;X-Amz-Signature=e65393371bd23625716d04155c5a72f12c95852c04043be776cda897c906db5e&amp;X-Amz-SignedHeaders=host&amp;x-id=GetObject" width="200"></p>'

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div>
        <div className="flex justify-between py-4 px-6 items-center bg-gray-3">
          <div className="text-bw-1 text-xl font-bold">Name</div>
          <div className="text-bw-1 text-xl font-bold">{formatTime(0)}</div>
          <ButtonCancelSubmit
            className={'flex gap-4 flex-row-reverse'}
            // color={color}
            submit={{
              title: 'Finish',
              size: 'medium',
              loading: false,
              disabled: false,
              onClick: () => {},
              //   full: fullWidthBtn,
            }}
            cancel={{
              title: 'Quit',
              size: 'medium',
              onClick: () => {},
              loading: false,
              //   full: fullWidthBtn,
            }}
          ></ButtonCancelSubmit>
        </div>
        {/* End Header */}
        <div className="px-6 bg-gray-4 shadow-solution py-4 relative">
          {/* <div className='mt-4'> */}
          <PaginationSAPP
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={100}
            type="row"
            pageSize={1}
            optionShowAll={<OptionShowAll />}
          />
          {/* </div> */}
        </div>
      </div>
      {/* <div className=''> */}
      {data?.display_type === DISPLAY_TYPE.VERTICAL ? (
        <div
          // onDoubleClick={(e) => {
          //   const element = e.target as any;
          //   if (element.localName === "video") {
          //     const content = element.currentSrc;
          //     if (content) {
          //       setOpenVideo({ status: true, src: content });
          //     }
          //   }
          // }}
          className="flex gap-5 h-[calc(100%-225px)] bg-gray-3"
          id={'preview-question'}
        >
          <div className="w-1/2 h-full overflow-auto bg-white p-6">
            <div
              className="editor-wrap"
              dangerouslySetInnerHTML={{ __html: topicDescription || '' }}
            ></div>
          </div>
          <div className="w-1/2 h-full overflow-auto bg-white py-6 ">
            <div className="px-6">
              {/* {type !== QUESTION_TYPES.ESSAY ? (
                  checkType(data, type)
                ) : (
                  <EssayQuestionPreview
                    data={essayData?.req}
                    question_content={data.question_content}
                    index={essayData?.index}
                    question_data={data}
                  />
                )} */}
              <OneChoiceQuestion data={data} control={control} />
            </div>
          </div>
        </div>
      ) : (
        <div
          // style={{ maxWidth: "948px", width: "100%", margin: "auto" }}
          // onDoubleClick={(e) => {
          //   const element = e.target as any;
          //   if (element.localName === "video") {
          //     const content = element.currentSrc;
          //     if (content) {
          //       setOpenVideo({ status: true, src: content });
          //     }
          //   }
          // }}
          className="max-w-screen-2md w-full m-auto h-[calc(100%-225px)] overflow-auto py-6 mt-2"
          id={'preview-question'}
        >
          <div>
            <div
              className="editor-wrap"
              dangerouslySetInnerHTML={{ __html: topicDescription || '' }}
            ></div>
          </div>

          {/* {type !== QUESTION_TYPES.ESSAY ? (
              checkType(data, type)
            ) : (
              <EssayQuestionPreview
                data={essayData?.req}
                question_content={data.question_content}
                index={essayData?.index}
                question_data={data}
              />
            )} */}
          <OneChoiceQuestion data={data} control={control} />
        </div>
      )}
      {/* </div> */}
      <div className="py-10 bg-gray-3"></div>
    </div>
  )
}

// eslint-disable-next-line import/no-unused-modules
export default Test
Test.layout = LAYOUT.FULLSCREEN_LAYOUT
