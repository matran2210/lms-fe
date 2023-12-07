import {
  CloseIcon,
  HelpIcon,
  HighlightIcon,
  ScratchPadIcon,
} from '@assets/icons'
import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
import ButtonIcon from '@components/base/button/ButtonIcon'
import HookFormCheckBox from '@components/base/checkbox/HookFormCheckBox'
import HookFormCheckBoxGroup from '@components/base/checkbox/HookFormCheckBoxGroup'
import PaginationSAPP from '@components/base/pagination/PaginationSAPP'
import TabSlide from '@components/base/tabSlide/TabSlide'
import HookFormTextArea from '@components/base/textfield/HookFormTextArea'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import MovableWindow from '@components/base/window'
import { formatTime } from '@components/common/timer'
import EssayQuestionPreview from '@components/questionType/ConstructedQuestion'
import DragNDropPreivew from '@components/questionType/DragNDrop'
import AddWordPreview from '@components/questionType/FillText'
import MatchingQuestion from '@components/questionType/MatchingQuestion'
import MultiChoiceQuestion from '@components/questionType/MultipleChoiceQuestion'
import OneChoiceQuestion from '@components/questionType/OneChoiceQuestion'
import SelectWord from '@components/questionType/SelectWordQuestion'
import { LAYOUT } from '@utils/constants'
import { uniqueId } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { DISPLAY_TYPE, QUESTION_TYPES } from 'src/constants'
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
  qType: 'TRUE_FALSE',
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
const data2 = {
  id: '260b9ac9-a0ce-42eb-bf3f-38e0fdb83ead',
  created_at: '2023-11-20T04:35:42.394Z',
  updated_at: '2023-11-20T04:35:42.394Z',
  deleted_at: null,
  key: 'QN000489',
  question_filter_id: null,
  question_topic_id: '721625a5-0c8b-4fe8-a88b-932782386a6c',
  question_content:
    '<p>type Chọn từ &nbsp;<span id="42876136-c187-4bf3-aac4-1951acdf7abf" class="question-content-tag" contenteditable="false">[_______]</span></p>',
  level: 'ADVANCED',
  qType: 'MATCHING',
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
      id: 'f8adb697-047d-412b-b233-ebc5f2339870',
      created_at: '2023-11-22T08:58:26.725Z',
      updated_at: '2023-11-22T08:58:26.725Z',
      deleted_at: null,
      question_id: '90847727-fe45-4748-a86b-13629cdf5ed3',
      answer: '232',
      is_correct: false,
      feedback: null,
      active: null,
      answer_position: 1,
    },
    {
      id: 'df662286-8e37-4596-b2b4-ed041254c10a',
      created_at: '2023-11-22T08:58:26.725Z',
      updated_at: '2023-11-22T08:58:26.725Z',
      deleted_at: null,
      question_id: '90847727-fe45-4748-a86b-13629cdf5ed3',
      answer: '34',
      is_correct: true,
      feedback: null,
      active: null,
      answer_position: 1,
    },
  ],

  question_filter: null,
  exhibits: [],
  requirements: [],
  // question_matchings: [],
  tags: [],
  question_matchings: [
    {
      id: '91ab656b-a675-4bec-99a0-9778445887cc',
      created_at: '2023-12-04T02:55:33.045Z',
      updated_at: '2023-12-04T02:55:33.045Z',
      deleted_at: null,
      question_id: '0217283d-f8c7-489f-9588-5814a864201b',
      content: 'as',
      answer_id: '1ea7e8dd-03d0-4cfc-b0c5-2b4ae7756669',
      answer: {
        id: '1ea7e8dd-03d0-4cfc-b0c5-2b4ae7756669',
        created_at: '2023-12-04T02:55:33.045Z',
        updated_at: '2023-12-04T02:55:33.045Z',
        deleted_at: null,
        question_id: null,
        answer: 'aa',
        is_correct: true,
        feedback: null,
        active: null,
        answer_position: 1,
      },
    },
    {
      id: 'f2a73692-04c0-4368-917b-944894e4ef34',
      created_at: '2023-12-04T02:55:33.045Z',
      updated_at: '2023-12-04T02:55:33.045Z',
      deleted_at: null,
      question_id: '0217283d-f8c7-489f-9588-5814a864201b',
      content: 'dd',
      answer_id: '3bf1d2a9-add9-43de-91a8-d2951f452571',
      answer: {
        id: '3bf1d2a9-add9-43de-91a8-d2951f452571',
        created_at: '2023-12-04T02:55:33.045Z',
        updated_at: '2023-12-04T02:55:33.045Z',
        deleted_at: null,
        question_id: null,
        answer: 'qq',
        is_correct: true,
        feedback: null,
        active: null,
        answer_position: 2,
      },
    },
    {
      id: 'f2a73692-04c0-4368-917b-944894e4ef35',
      created_at: '2023-12-04T02:55:33.045Z',
      updated_at: '2023-12-04T02:55:33.045Z',
      deleted_at: null,
      question_id: '0217283d-f8c7-489f-9588-5814a864201b',
      content: 'dd',
      answer_id: '3bf1d2a9-add9-43de-91a8-d2951f452571',
      answer: {
        id: '3bf1d2a9-add9-43de-91a8-d2951f4525711',
        created_at: '2023-12-04T02:55:33.045Z',
        updated_at: '2023-12-04T02:55:33.045Z',
        deleted_at: null,
        question_id: null,
        answer: 'qq',
        is_correct: true,
        feedback: null,
        active: null,
        answer_position: 2,
      },
    },
    {
      id: 'f2a73692-04c0-4368-917b-944894e4ef342',
      created_at: '2023-12-04T02:55:33.045Z',
      updated_at: '2023-12-04T02:55:33.045Z',
      deleted_at: null,
      question_id: '0217283d-f8c7-489f-9588-5814a864201b',
      content: 'dd',
      answer_id: '3bf1d2a9-add9-43de-91a8-d2951f452571',
      answer: {
        id: '3bf1d2a9-add9-43de-91a8-d2951f4525713',
        created_at: '2023-12-04T02:55:33.045Z',
        updated_at: '2023-12-04T02:55:33.045Z',
        deleted_at: null,
        question_id: null,
        answer: 'qq',
        is_correct: true,
        feedback: null,
        active: null,
        answer_position: 2,
      },
    },
    {
      id: 'f2a73692-04c0-4368-917b-944894e4ef341',
      created_at: '2023-12-04T02:55:33.045Z',
      updated_at: '2023-12-04T02:55:33.045Z',
      deleted_at: null,
      question_id: '0217283d-f8c7-489f-9588-5814a864201b',
      content: 'dd',
      answer_id: '3bf1d2a9-add9-43de-91a8-d2951f452571',
      answer: {
        id: '3bf1d2a9-add9-43de-91a8-d2951f45257111',
        created_at: '2023-12-04T02:55:33.045Z',
        updated_at: '2023-12-04T02:55:33.045Z',
        deleted_at: null,
        question_id: null,
        answer: 'qq',
        is_correct: true,
        feedback: null,
        active: null,
        answer_position: 2,
      },
    },
  ],
} as any
const dataDragNDrop = {
  id: '8f49e49b-c48e-481d-81c0-a5a5b73c8241',
  created_at: '2023-11-07T07:59:11.323Z',
  updated_at: '2023-12-01T09:38:17.079Z',
  deleted_at: null,
  key: 'QN000326',
  question_filter_id: null,
  question_topic_id: '7cac653a-d91d-4c7f-a324-cc7ede66da7e',
  question_content:
    '<p><strong>Drag- Drop</strong></p>\n<p><strong>c&acirc;u 6</strong>:&nbsp; ho&agrave;n th&agrave;nh đoạn sau:</p>\n<p dir="ltr">tatesmen define a family as &ldquo;a group of individuals having a common dwelling and related by blood, adoption or marriage, <span id="3908eb7b-ce32-44f5-b9ed-3d220a14103f" class="question-content-tag" contenteditable="false">[_______]</span> includes common-law relationships.&rdquo; Most people are born into one of these groups and <span id="299f4b5b-79cc-4e57-a306-f47bb4a3364d" class="question-content-tag" contenteditable="false">[_______]</span> live their lives as a family in such a group.</p>\n<p dir="ltr">Although the definition of a family may not change, <span id="ec251658-90af-468c-830b-46080b411082" class="question-content-tag" contenteditable="false">[_______]</span>.relationship of people to each other within the family group changes as society changes. More and more wives are&nbsp;<span id="f71b5419-ac10-49cd-b27b-07b2a4eb45f4" class="question-content-tag" contenteditable="false">[_______]</span>paying jobs<span id="0340aa86-2985-4841-8f70-59d7412ed8c6" class="question-content-tag" contenteditable="false">[_______]</span></p>',
  level: 'FUNDAMENTAL',
  qType: 'DRAG_DROP',
  assignment_type: 'TEXT',
  response_option: null,
  question_files: null,
  display_type: 'VERTICAL',
  solution: '<p>sol;ution</p>',
  status: 'PUBLISH',
  hint: '',
  files: [],
  answers: [
    {
      id: '5fd73cc0-4f05-4990-97d8-7850d2359065',
      created_at: '2023-12-01T09:38:17.079Z',
      updated_at: '2023-12-01T09:38:17.079Z',
      deleted_at: null,
      question_id: '8f49e49b-c48e-481d-81c0-a5a5b73c8241',
      answer: 'which   group of individuals having a common dwelling',
      is_correct: true,
      feedback: null,
      active: null,
      answer_position: 1,
    },
    {
      id: '579604c8-fc61-4157-9f4e-f1f616dea3e6',
      created_at: '2023-12-01T09:38:17.079Z',
      updated_at: '2023-12-01T09:38:17.079Z',
      deleted_at: null,
      question_id: '8f49e49b-c48e-481d-81c0-a5a5b73c8241',
      answer: 'that',
      is_correct: true,
      feedback: null,
      active: null,
      answer_position: 2,
    },
    {
      id: '40e2d088-e7f8-41eb-9703-cc673f6b2ca7',
      created_at: '2023-12-01T09:38:17.079Z',
      updated_at: '2023-12-01T09:38:17.079Z',
      deleted_at: null,
      question_id: '8f49e49b-c48e-481d-81c0-a5a5b73c8241',
      answer: 'what',
      is_correct: true,
      feedback: null,
      active: null,
      answer_position: 3,
    },
    {
      id: '39e0d9f6-0be3-4efd-9bd0-86d1aeba14cc',
      created_at: '2023-12-01T09:38:17.079Z',
      updated_at: '2023-12-01T09:38:17.079Z',
      deleted_at: null,
      question_id: '8f49e49b-c48e-481d-81c0-a5a5b73c8241',
      answer: 'must',
      is_correct: true,
      feedback: null,
      active: null,
      answer_position: 4,
    },
    {
      id: '02ee0d51-ef09-4657-a5b3-c793e87c8fd7',
      created_at: '2023-12-01T09:38:17.079Z',
      updated_at: '2023-12-01T09:38:17.079Z',
      deleted_at: null,
      question_id: '8f49e49b-c48e-481d-81c0-a5a5b73c8241',
      answer: 'need',
      is_correct: true,
      feedback: null,
      active: null,
      answer_position: 5,
    },
    {
      id: '6e84ab95-59df-48bb-8c23-ca1b382a1fc1',
      created_at: '2023-12-01T09:38:17.079Z',
      updated_at: '2023-12-01T09:38:17.079Z',
      deleted_at: null,
      question_id: '8f49e49b-c48e-481d-81c0-a5a5b73c8241',
      answer: 'some',
      is_correct: true,
      feedback: null,
      active: null,
      answer_position: 6,
    },
    {
      id: '3adb283f-0df7-4a13-9fc0-e604b7d8534a',
      created_at: '2023-12-01T09:38:17.079Z',
      updated_at: '2023-12-01T09:38:17.079Z',
      deleted_at: null,
      question_id: '8f49e49b-c48e-481d-81c0-a5a5b73c8241',
      answer: 'hope',
      is_correct: true,
      feedback: null,
      active: null,
      answer_position: 7,
    },
    {
      id: '7d290190-e322-476b-8241-af23743f38cb',
      created_at: '2023-12-01T09:38:17.079Z',
      updated_at: '2023-12-01T09:38:17.079Z',
      deleted_at: null,
      question_id: '8f49e49b-c48e-481d-81c0-a5a5b73c8241',
      answer: 'fly',
      is_correct: true,
      feedback: null,
      active: null,
      answer_position: 8,
    },
  ],
  question_filter: null,
  exhibits: [],
  requirements: [],
  question_matchings: [],
  tags: [],
}
const dataConstructed = {
  id: '8ddf226b-750d-4774-b06d-c7e94cd2e929',
  created_at: '2023-11-22T08:47:06.598Z',
  updated_at: '2023-12-05T04:05:30.832Z',
  deleted_at: null,
  key: 'QN000517',
  question_filter_id: null,
  question_topic_id: '7cac653a-d91d-4c7f-a324-cc7ede66da7e',
  question_content:
    '<p>Đây là question content cảu&nbsp; tự luận save new</p>\n<ul style="list-style-type: circle;">\n<li>Người phát hành trái phiếu có thể là doanh nghiệp (gọi là trái phiếu doanh nghiệp) hay một tổ chức của chính quyền công như: Kho bạc nhà nước (gọi là trái phiếu kho bạc) hoặc chính quyền (gọi là công trái hoặc trái phiếu chính phủ).</li>\n<li>Bất cứ cá nhân, doanh nghiệp hoặc chính phủ đều có thể mua trái phiếu hay trái chủ. Trên trái phiếu có thể ghi tên trái chủ gọi là trái phiếu ghi danh hoặc không được ghi tên thì gọi là trái phiếu vô danh.</li>\n</ul>',
  level: 'ADVANCED',
  qType: 'ESSAY',
  assignment_type: 'ALL',
  response_option: 'WORD',
  question_files: null,
  display_type: 'VERTICAL',
  solution: '<p>giải pháp cho tự&nbsp; luaanjsave new</p>',
  status: 'PUBLISH',
  hint: '',
  files: [],
  answers: [],
  question_filter: null,
  exhibits: [
    {
      id: '5b0b22b4-76fd-4cec-a6b4-43f2ae9e9aea',
      created_at: '2023-12-05T04:05:30.832Z',
      updated_at: '2023-12-05T04:05:30.832Z',
      deleted_at: null,
      question_id: '8ddf226b-750d-4774-b06d-c7e94cd2e929',
      name: 'exhibit của yêu cầu 2_ file từ resource',
      description: '',
      files: [
        {
          id: '33cf9749-5405-4cdc-b0f0-b045ad6a5643',
          created_at: '2023-12-05T04:05:30.832Z',
          updated_at: '2023-12-05T04:05:30.832Z',
          deleted_at: null,
          dom_id: null,
          type: 'attached',
          object_id: '5b0b22b4-76fd-4cec-a6b4-43f2ae9e9aea',
          resource_id: '0d771d0a-6ea0-45a2-adb4-ebb716e40b0b',
          resource: {
            id: '0d771d0a-6ea0-45a2-adb4-ebb716e40b0b',
            name: 'THKQĐG-2023-06 (1).pdf',
            file_key: 'question/1700553417966_THKQĐG-2023-06 (1).pdf',
            stream_url: null,
            cloudflare_video_id: null,
            status: 'CREATED',
            url: 'https://cdn-dev.sapp.edu.vn/question/1700553417966_THKQ%C4%90G-2023-06%20%281%29.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20231206%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20231206T071130Z&X-Amz-Expires=3600&X-Amz-Signature=26e543205251a899c04895e73871843f946f2af927f2dde9af14388e5de30054&X-Amz-SignedHeaders=host&x-id=GetObject',
            url_expired_in: null,
            sub_url: null,
            thumbnail: null,
          },
        },
      ],
    },
    {
      id: '0e7c1826-2c6f-4dc0-8e08-8d906cb67f83',
      created_at: '2023-12-05T04:05:30.832Z',
      updated_at: '2023-12-05T04:05:30.832Z',
      deleted_at: null,
      question_id: '8ddf226b-750d-4774-b06d-c7e94cd2e929',
      name: 'exhibit của phần yeu cầu  1 iếu chính quyền địa phươn vốn cho công trình, dự án đầu tư của địa  iếu chính quyền địa phươn vốn cho công trình, dự án đầu tư của địa',
      description:
        '<p>đây là description của exhibit1&nbsp;</p>\n<ul style="list-style-type: circle;">\n<li>Trái phiếu chính quyền địa phương do Ủy ban nhân dân tỉnh, thành phố phát hành với kỳ hạn từ một năm trở lên nhằm huy động vốn cho công trình, dự án đầu tư của địa phương. Nguồn tiền hoàn trả trái phiếu thường là nguồn thu ngân sách địa phương.</li>\n<li>\n<p>Trái phiếu doanh nghiệp&nbsp;do doanh nghiệp (trong đó bao gồm ngân hàng) phát hành để đáp ứng nhu cầu vốn theo nguyên tắc tự vay, tự trả, tự chịu trách nhiệm về khả năng trả nợ.</p>\n<h3><strong>Trái phiếu có cần tài sản đảm bảo?</strong></h3>\n<p>Trái phiếu có hai loại: Trái phiếu có tài sản đảm bảo&nbsp;là loại trái phiếu mà tổ chức phát hành dùng tài sản như bất động sản, máy móc – thiết bị, cổ phiếu để đảm bảo cho việc phát hành. Thông thường tài sản cầm cố có giá trị thị trường lớn hơn mệnh giá trái phiếu đã phát hành. Trong trường hợp tổ chức phát hành mất khả năng thanh toán, trái chủ có quyền phát mãi tài sản đảm bảo để thu hồi số tiền còn nợ.</p>\n<p>Trái phiếu không có tài sản đảm bảo có tính chất ngược lại nên mức độ rủi ro cao hơn.</p>\n</li>\n</ul>\n<p>&nbsp;</p>\n<p>&nbsp;</p>',
      files: [],
    },
  ],
  requirements: [
    {
      id: 'ebe2101f-4f80-4136-8b24-1a04350ab8f9',
      created_at: '2023-12-05T04:05:30.832Z',
      updated_at: '2023-12-05T04:05:30.832Z',
      deleted_at: null,
      question_id: '8ddf226b-750d-4774-b06d-c7e94cd2e929',
      name: 'Yêu cầu 1: hoàn thành đv Trái phiếu chính quyền địa phươn vốn cho công trình, dự án đầu tư của địa  iếu chính quyền địa phươn vốn cho công trình, dự án đầu tư của địa',
      description:
        '<p>Đây là description của Yêu cầu 1</p>\n<p>Trái phiếu doanh nghiệp do doanh nghiệp (trong đó bao gồm ngân hàng) phát hành để đáp ứng nhu cầu vốn theo nguyên tắc tự vay, tự trả, tự chịu trách nhiệm về khả năng trả nợ.</p>\n<p>Trái phiếu có hai loại: Trái phiếu có tài sản đảm bảo là loại trái phiếu mà tổ chức phát hành dùng tài sản như bất động sản, máy móc – thiết bị, cổ phiếu để đảm bảo cho việc phát hành. Thông thường tài sản cầm cố có giá trị thị trường lớn hơn mệnh giá trái phiếu đã phát hành. Trong trường hợp tổ chức phát hành mất khả năng thanh toán, trái chủ có quyền phát mãi tài sản đảm bảo để thu hồi số tiền còn nợ.Trái phiếu không có tài sản đảm bảo có tính chất ngược lại nên mức độ rủi ro cao hơn.</p>',
      files: [],
    },
    {
      id: 'd2a41f17-4d8e-445a-a157-11111a73a464',
      created_at: '2023-12-05T04:05:30.832Z',
      updated_at: '2023-12-05T04:05:30.832Z',
      deleted_at: null,
      question_id: '8ddf226b-750d-4774-b06d-c7e94cd2e929',
      name: 'yêu cầu 2: nối câu sau',
      description: '<p>Description của yêu cầu 2</p>',
      files: [],
    },
  ],
  question_matchings: [],
  tags: [],
}
const Test = () => {
  const [currentPage, setCurrentPage] = useState<any>(1)
  const { control, handleSubmit } = useForm()
  const { control: controlFilter } = useForm()
  const [essayData, setEssayData] = useState<any>()
  const [openScratchPad, setOpenScratchPad] = useState<Array<any>>([])
  const [onFocusingPad, setOnFocusingPad] = useState('')
  const handleOpenScratchPad = () => {
    setOpenScratchPad((prev) => {
      let arr = [...prev]
      arr.push(uniqueId('scratchPad'))
      return arr
    })
  }
  const handleCloseScratchPad = (pad: string) => {
    setOpenScratchPad((prev) => {
      let arr = [...prev]
      const newArr = arr.filter((e) => e !== pad)
      return newArr
    })
  }
  const OptionShowAll = () => {
    return (
      <div className="w-max">
        <HookFormCheckBoxGroup
          multiple
          control={controlFilter}
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

  const topicDescription =
    '<p><video width="300" height="150" poster="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/thumbnails/thumbnail.jpg" id="c13d87be-b6e7-46e5-9dde-db5fa983c6b6" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848">\n        <source src="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/manifest/video.m3u8" id="124f7da6-09a3-4d8a-887f-0689e6a3bda0" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848" resource_status="READY_TO_STREAM">\n      </video>Topic Name</p>\n<p><img id="9b9cd785-047b-4380-9ba0-d1ef164d6084" resource_id="fe119bdc-c5db-49fa-ba0b-00ebbec6d121" title="buon-anh-meo-khoc-cute.jpg" src="https://cdn-dev.sapp.edu.vn/topic/1700217686841_buon-anh-meo-khoc-cute.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&amp;X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20231117%2Fap-southeast-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20231117T104127Z&amp;X-Amz-Expires=3600&amp;X-Amz-Signature=e65393371bd23625716d04155c5a72f12c95852c04043be776cda897c906db5e&amp;X-Amz-SignedHeaders=host&amp;x-id=GetObject" width="200"></p><p><video width="300" height="150" poster="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/thumbnails/thumbnail.jpg" id="c13d87be-b6e7-46e5-9dde-db5fa983c6b6" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848">\n        <source src="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/manifest/video.m3u8" id="124f7da6-09a3-4d8a-887f-0689e6a3bda0" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848" resource_status="READY_TO_STREAM">\n      </video>Topic Name</p>\n<p><img id="9b9cd785-047b-4380-9ba0-d1ef164d6084" resource_id="fe119bdc-c5db-49fa-ba0b-00ebbec6d121" title="buon-anh-meo-khoc-cute.jpg" src="https://cdn-dev.sapp.edu.vn/topic/1700217686841_buon-anh-meo-khoc-cute.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&amp;X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20231117%2Fap-southeast-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20231117T104127Z&amp;X-Amz-Expires=3600&amp;X-Amz-Signature=e65393371bd23625716d04155c5a72f12c95852c04043be776cda897c906db5e&amp;X-Amz-SignedHeaders=host&amp;x-id=GetObject" width="200"></p><p><video width="300" height="150" poster="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/thumbnails/thumbnail.jpg" id="c13d87be-b6e7-46e5-9dde-db5fa983c6b6" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848">\n        <source src="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/manifest/video.m3u8" id="124f7da6-09a3-4d8a-887f-0689e6a3bda0" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848" resource_status="READY_TO_STREAM">\n      </video>Topic Name</p>\n<p><img id="9b9cd785-047b-4380-9ba0-d1ef164d6084" resource_id="fe119bdc-c5db-49fa-ba0b-00ebbec6d121" title="buon-anh-meo-khoc-cute.jpg" src="https://cdn-dev.sapp.edu.vn/topic/1700217686841_buon-anh-meo-khoc-cute.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&amp;X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20231117%2Fap-southeast-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20231117T104127Z&amp;X-Amz-Expires=3600&amp;X-Amz-Signature=e65393371bd23625716d04155c5a72f12c95852c04043be776cda897c906db5e&amp;X-Amz-SignedHeaders=host&amp;x-id=GetObject" width="200"></p><p><video width="300" height="150" poster="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/thumbnails/thumbnail.jpg" id="c13d87be-b6e7-46e5-9dde-db5fa983c6b6" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848">\n        <source src="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/manifest/video.m3u8" id="124f7da6-09a3-4d8a-887f-0689e6a3bda0" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848" resource_status="READY_TO_STREAM">\n      </video>Topic Name</p>\n<p><img id="9b9cd785-047b-4380-9ba0-d1ef164d6084" resource_id="fe119bdc-c5db-49fa-ba0b-00ebbec6d121" title="buon-anh-meo-khoc-cute.jpg" src="https://cdn-dev.sapp.edu.vn/topic/1700217686841_buon-anh-meo-khoc-cute.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&amp;X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20231117%2Fap-southeast-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20231117T104127Z&amp;X-Amz-Expires=3600&amp;X-Amz-Signature=e65393371bd23625716d04155c5a72f12c95852c04043be776cda897c906db5e&amp;X-Amz-SignedHeaders=host&amp;x-id=GetObject" width="200"></p><p><video width="300" height="150" poster="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/thumbnails/thumbnail.jpg" id="c13d87be-b6e7-46e5-9dde-db5fa983c6b6" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848">\n        <source src="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/manifest/video.m3u8" id="124f7da6-09a3-4d8a-887f-0689e6a3bda0" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848" resource_status="READY_TO_STREAM">\n      </video>Topic Name</p>\n<p><img id="9b9cd785-047b-4380-9ba0-d1ef164d6084" resource_id="fe119bdc-c5db-49fa-ba0b-00ebbec6d121" title="buon-anh-meo-khoc-cute.jpg" src="https://cdn-dev.sapp.edu.vn/topic/1700217686841_buon-anh-meo-khoc-cute.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&amp;X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20231117%2Fap-southeast-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20231117T104127Z&amp;X-Amz-Expires=3600&amp;X-Amz-Signature=e65393371bd23625716d04155c5a72f12c95852c04043be776cda897c906db5e&amp;X-Amz-SignedHeaders=host&amp;x-id=GetObject" width="200"></p><p><video width="300" height="150" poster="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/thumbnails/thumbnail.jpg" id="c13d87be-b6e7-46e5-9dde-db5fa983c6b6" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848">\n        <source src="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/manifest/video.m3u8" id="124f7da6-09a3-4d8a-887f-0689e6a3bda0" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848" resource_status="READY_TO_STREAM">\n      </video>Topic Name</p>\n<p><img id="9b9cd785-047b-4380-9ba0-d1ef164d6084" resource_id="fe119bdc-c5db-49fa-ba0b-00ebbec6d121" title="buon-anh-meo-khoc-cute.jpg" src="https://cdn-dev.sapp.edu.vn/topic/1700217686841_buon-anh-meo-khoc-cute.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&amp;X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20231117%2Fap-southeast-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20231117T104127Z&amp;X-Amz-Expires=3600&amp;X-Amz-Signature=e65393371bd23625716d04155c5a72f12c95852c04043be776cda897c906db5e&amp;X-Amz-SignedHeaders=host&amp;x-id=GetObject" width="200"></p><p><video width="300" height="150" poster="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/thumbnails/thumbnail.jpg" id="c13d87be-b6e7-46e5-9dde-db5fa983c6b6" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848">\n        <source src="https://customer-qf43f9e6huohhr1o.cloudflarestream.com/eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIn0.eyJzdWIiOiJhYzlhMGVlNWYxMjUzZGJkYjM0MGMwMGRkY2U0YTUxYiIsImtpZCI6IjFjNDk4MmYzMzEyYjZmODI0YzVjZDc5NTFhOWE5YTEwIiwiZXhwIjoiMTcwMTQxOTAwOCIsIm5iZiI6IjE3MDEzNzIyMDkiLCJkb3dubG9hZGFibGUiOnRydWV9.KX6r8p6VTqIFt29YjOD7CJw0fh2u0NsL-7evUyupYoQcQEgNAaS3G-GC-EzQdNgWfi_X3hmRxuk9_JvTdQUGBeVI6xRhr4ktEaELprXErcOqTA2qDEo9xuNlHngYsCwzwZvB4cORgmtXG4gO7mAEpmxfPQ7mpXP-3Xb2V66NbbDzrRCBqUorkHyl6YuHi_IYkmpr1_cBj2vEACQ-AHHrRdhL4Jz0xo1qdNgjr8w8j8UCMfrIQajAcj1XKlLkNYv_JmNoN4K9yr4_3_J6HDwV-FtveLT6T2gReNHL6RRl8aPNa8SJl-mQ0njo0rgJAa2wcgjUIPiyngDCCBPV3jQAiA/manifest/video.m3u8" id="124f7da6-09a3-4d8a-887f-0689e6a3bda0" resource_id="851d2549-5673-42e4-bbba-9c3d1d5de848" resource_status="READY_TO_STREAM">\n      </video>Topic Name</p>\n<p><img id="9b9cd785-047b-4380-9ba0-d1ef164d6084" resource_id="fe119bdc-c5db-49fa-ba0b-00ebbec6d121" title="buon-anh-meo-khoc-cute.jpg" src="https://cdn-dev.sapp.edu.vn/topic/1700217686841_buon-anh-meo-khoc-cute.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&amp;X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20231117%2Fap-southeast-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20231117T104127Z&amp;X-Amz-Expires=3600&amp;X-Amz-Signature=e65393371bd23625716d04155c5a72f12c95852c04043be776cda897c906db5e&amp;X-Amz-SignedHeaders=host&amp;x-id=GetObject" width="200"></p>'
  const checkType = (data: any, type: string) => {
    switch (type) {
      case QUESTION_TYPES.TRUE_FALSE:
        return <OneChoiceQuestion data={data} control={control} />
      case QUESTION_TYPES.ONE_CHOICE:
        return <OneChoiceQuestion data={data} control={control} />
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return <MultiChoiceQuestion data={data} control={control} />
      case QUESTION_TYPES.MATCHING:
        return <MatchingQuestion data={data} action={getAnswerMatching} />
      case QUESTION_TYPES.FILL_WORD:
        return <AddWordPreview data={data} action={getValueFillText} />
      case QUESTION_TYPES.DRAG_DROP:
        return <DragNDropPreivew data={data} action={getAnswerDragNDrop} />
      case QUESTION_TYPES.SELECT_WORD:
        return <SelectWord data={data} action={getValueSelectText} />
      case QUESTION_TYPES.ESSAY:
        return (
          <EssayQuestionPreview
            data={essayData?.req}
            question_content={dataConstructed.question_content}
            index={essayData?.index}
            question_data={dataConstructed}
            control={control}
          />
        )
      default:
        return <div></div>
    }
  }
  const getValueFillText = () => {
    let value = []
    const inputs = document.querySelectorAll('input[stringHTML="true"]') as any
    for (let e of inputs) {
      value.push(e.value)
    }
    return value
  }
  const getValueSelectText = () => {
    let value = [] as any
    const inputs = document.querySelectorAll(
      'select.sapp-select--selectword-preview',
    ) as any

    for (let e of inputs) {
      value.push(e.value)
    }
    return value
  }
  const getAnswerMatching = () => {
    let value = [] as any
    const inputs = document.querySelectorAll('.sapp-match-result') as any
    for (let e of inputs) {
      value.push(e.innerText)
    }
    return value
  }
  const getAnswerDragNDrop = () => {
    let value = [] as any
    const inputs = document.querySelectorAll('.sapp-input-dragNDrop') as any
    for (let e of inputs) {
      const idAnswer = e.querySelector('span')

      // console.log(idDiv?.id);

      value.push({ id: e.id, value: e.innerText, idAnswer: idAnswer?.id })
    }
    return value
  }
  useEffect(() => {
    if (dataConstructed?.requirements) {
      setEssayData({ req: dataConstructed?.requirements[0], index: 0 })
    }
  }, [])
  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden relative">
      {/* Header */}
      <div>
        <div className="flex justify-between py-4 px-6 items-center bg-gray-3 ">
          <div className="text-bw-1 text-xl font-bold w-1/3 truncate">Name</div>
          <div className="text-bw-1 text-xl font-bold w-1/3 justify-center flex">
            {formatTime(0)}
          </div>
          <ButtonCancelSubmit
            className={'flex gap-4 flex-row-reverse w-1/3'}
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
          {/* <PaginationSAPP
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={100}
            type="row"
            pageSize={1}
            optionShowAll={<OptionShowAll />}
          /> */}
          <TabSlide
            data={[
              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
              20, 21, 22, 23, 24, 25, 26, 27, 28,
            ]}
            currentTab={currentPage}
            setCurrentTab={setCurrentPage}
            optionShowAll={<OptionShowAll />}
            handleChangeTab={(e: any) => {
              setCurrentPage(e)
            }}
          />
          {/* </div> */}
        </div>
      </div>
      {/* <div className=''> */}
      {dataConstructed?.display_type === DISPLAY_TYPE.VERTICAL ? (
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
              {/* {type !== QUESTION_TYPES.ESSAY ? ( */}
              {checkType(dataConstructed, dataConstructed.qType)}
              {/* ) : (
                  <EssayQuestionPreview
                    data={essayData?.req}
                    question_content={data.question_content}
                    index={essayData?.index}
                    question_data={data}
                  />
                )} */}
              {/* <OneChoiceQuestion data={data} control={control} /> */}
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

          {/* {type !== QUESTION_TYPES.ESSAY ? ( */}
          {checkType(dataDragNDrop, dataDragNDrop.qType)}
          {/* ) : (
              <EssayQuestionPreview
                data={essayData?.req}
                question_content={data.question_content}
                index={essayData?.index}
                question_data={data}
              />
            )}
          <OneChoiceQuestion data={data} control={control} /> */}
        </div>
      )}
      {openScratchPad.map((e, index: number) => {
        return (
          <MovableWindow
            position={{
              width: '400px',
              height: '300px',
            }}
            key={e}
            onClick={() => setOnFocusingPad(e)}
            zIndex={
              onFocusingPad === e ? openScratchPad.length + 10 : index + 10
            }
          >
            <div className="absolute h-full w-full  top-0 left-0 border">
              <div className="flex w-6 items-center bg-gray-2 w-full h-[40px] justify-between px-5">
                <div>Scratch Pad</div>
                {/* <CloseIcon */}
                <button onClick={() => handleCloseScratchPad(e)}>
                  <CloseIcon />
                </button>
              </div>
              {/* <div className='flex flex-'> */}
              <HookFormTextArea
                placeholder="Take a note..."
                control={control}
                name={e}
                className="w-full h-[calc(100%-40px)] sapp-text-area"
              />
              {/* </div> */}
            </div>
          </MovableWindow>
        )
      })}

      {/* </div> */}
      <div className=" bg-gray-3 flex items-center h-full">
        <button className="h-full">
          <div className="flex items-center gap-3 ps-6 ">
            <HelpIcon />
            <div className="font-normal text-sm pe-6 border-r">Help</div>
          </div>
        </button>
        <button className="h-full">
          <div className="flex items-center gap-3 ps-6 ">
            <HighlightIcon />
            <div className="font-normal text-sm pe-6 border-r">Highlight</div>
          </div>
        </button>
        <button className="h-full" onClick={handleOpenScratchPad}>
          <div className="flex items-center gap-3 ps-6 ">
            <ScratchPadIcon />
            <div className="font-normal text-sm pe-6 border-r">Scratch Pad</div>
          </div>
        </button>
      </div>
    </div>
  )
}

// eslint-disable-next-line import/no-unused-modules
export default Test
Test.layout = LAYOUT.FULLSCREEN_LAYOUT
