import { IQuestion, QUESTION_LEVELS, QUESTION_TYPES } from '@lms/core'
import { StoryStep } from 'src/type/storyline'

// data/storyline/linear.ts
export const steps: StoryStep[] = [
  {
    id: 'introduce',
    title: 'Introduction',
    blocks: [
      {
        id: 'introduction-block-1',
        type: 'text',
        text: `<div>
            <p>Telline is a call center operator operating in the United States of America. It has about 250 employees, 220 of which work in their call centers located in its Phoenix headquarter, Albuquerque, and Salt Lake City.

The other 30 employees work in management and sales and operate from the company’s headquarters. They are a closely-knit team, most of them working at the company for many years, if not decades. The dozen or so account executives have a fairly cosy job. They focus on retaining a selected number of large corporate customers, some of which have been with the company since it was founded in 1980!</p>
            <image src="https://images.pexels.com/photos/36004284/pexels-photo-36004284.jpeg" alt="Office" />
            <p>In your interviews with Dorothy, she stresses the importance of retaining current customers. Suzan, the CFO, emphasizes the importance of a financially healthy organization. Her number one outcome is the return on capital employed, which is the company’s operating income (or EBIT) divided by the capital employed. This metric shows how successful the organization is at earning a profit from capital used in the business. This percentage has long been around 15% but Suzan wants to bring this to 20%.

After your talks with managers, you get a fairly consistent picture. Thanks to Dorothy's efforts, managers are aligned on their target, which is first call resolution, representing the percentage of callers whose problem is solved in the first call, customer satisfaction, measured through net promoter scores, and service levels, which is the percentage of callers answered in a given number of seconds. The aim is to have 85% of calls answered within 30 seconds. However, the current score is around 65%.</div>`,
        reveal: 'continue',
      },
      {
        id: 'introduction-block-1',
        type: 'text',
        text: `<div>
            <p>Telline is a call center operator operating in the United States of America. It has about 250 employees, 220 of which work in their call centers located in its Phoenix headquarter, Albuquerque, and Salt Lake City.

The other 30 employees work in management and sales and operate from the company’s headquarters. They are a closely-knit team, most of them working at the company for many years, if not decades. The dozen or so account executives have a fairly cosy job. They focus on retaining a selected number of large corporate customers, some of which have been with the company since it was founded in 1980!</p>
            <p>In your interviews with Dorothy, she stresses the importance of retaining current customers. Suzan, the CFO, emphasizes the importance of a financially healthy organization. Her number one outcome is the return on capital employed, which is the company’s operating income (or EBIT) divided by the capital employed. This metric shows how successful the organization is at earning a profit from capital used in the business. This percentage has long been around 15% but Suzan wants to bring this to 20%.

After your talks with managers, you get a fairly consistent picture. Thanks to Dorothy's efforts, managers are aligned on their target, which is first call resolution, representing the percentage of callers whose problem is solved in the first call, customer satisfaction, measured through net promoter scores, and service levels, which is the percentage of callers answered in a given number of seconds. The aim is to have 85% of calls answered within 30 seconds. However, the current score is around 65%.</div>`,
        reveal: 'continue',
      },
      {
        id: 'introduction-block-1',
        type: 'text',
        text: `<div>
            <p>Telline is a call center operator operating in the United States of America. It has about 250 employees, 220 of which work in their call centers located in its Phoenix headquarter, Albuquerque, and Salt Lake City.

The other 30 employees work in management and sales and operate from the company’s headquarters. They are a closely-knit team, most of them working at the company for many years, if not decades. The dozen or so account executives have a fairly cosy job. They focus on retaining a selected number of large corporate customers, some of which have been with the company since it was founded in 1980!</p>
            <image src="https://images.pexels.com/photos/35676134/pexels-photo-35676134.jpeg" alt="Office" />
            <p>In your interviews with Dorothy, she stresses the importance of retaining current customers. Suzan, the CFO, emphasizes the importance of a financially healthy organization. Her number one outcome is the return on capital employed, which is the company’s operating income (or EBIT) divided by the capital employed. This metric shows how successful the organization is at earning a profit from capital used in the business. This percentage has long been around 15% but Suzan wants to bring this to 20%.

After your talks with managers, you get a fairly consistent picture. Thanks to Dorothy's efforts, managers are aligned on their target, which is first call resolution, representing the percentage of callers whose problem is solved in the first call, customer satisfaction, measured through net promoter scores, and service levels, which is the percentage of callers answered in a given number of seconds. The aim is to have 85% of calls answered within 30 seconds. However, the current score is around 65%.</div>`,
        reveal: 'continue',
      },
    ],
  },
  {
    id: 'task-2',
    title: 'Task',
    blocks: [
      {
        id: 'task-2-block-1',
        type: 'text',
        text: `<div>
          <h2 class="text-xl font-semibold mb-4">Where can I get some?</h2>
            <p>Telline is a call center...</p>
            <p class="mb-4">The other 30 employees...</p>
            <image src="/thumbnail.png" alt="Office" />
            <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</p>
          </div>`,
        reveal: 'auto',
      },
      {
        id: 'task-2-block-2',
        type: 'text',
        text: `<div>
          <h2 class="text-xl font-semibold mb-4">Where can I get some?</h2>
            <p>Telline is a call center...</p>
            <p class="mb-4">The other 30 employees...</p>
            <p>question video</p>
            <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</p>
          </div>`,
        reveal: 'auto',
      },
      {
        id: 'task-2-block-3',
        type: 'quiz',
        question: {
          id: 'c95f4b9d-ef02-46d3-81a7-931ecb1376a2',
          question_content:
            '<p>question video</p>\n<p>text tr&ecirc;n</p>\n<p style="text-align: left;">text trước <video width="525" height="294" poster="/assets/default_thumbnail_video-203s-ZWn.png" id="ddeaa52d-50af-4e0e-bd3b-f8054e2bc45e" resource_id="c4e4fbab-14b4-4086-b399-f13f357875aa"> <source src="null" token="eyJhbGciOiJSUzI1NiIsImtpZCI6IjU1M2FhNzhlMDJjOGViZTcxYjQzMzVlYzI4NTBmNzY2In0.eyJzdWIiOiI1MjMzOGM5YjQ5YTNhZTdlMDZhMGU0MDcxZDdkZjY3NyIsImtpZCI6IjU1M2FhNzhlMDJjOGViZTcxYjQzMzVlYzI4NTBmNzY2IiwiZXhwIjoxNzcwNDA5MDcyfQ.UsgwjlxudyS_43_uoKfNRPj6_KgZcTnZ0uzR5v0InXu3zlr5tDwxEMHXnWNLeva1-HL42FeyCnWJiK__uxbXmpjP-8nrAn8wzYK1FQQ7vIEwpi_fKWoPVj06gLcVRgN09JNGzYfz98n0TvAm3pymhV1Zd8TGLp8RH1cibdMXU0enaA6xIge1bR4wD6G17CGgqcA0uAXfXdhN-pYrkAAavZyIjOEwcFcNl1iqwk7-9Yb6GiGviL5YzmA1DSgEbvdS7s6VabNA-NFnas5NFatz2hcNQHR-3zgWlcEhemigrgocWIoQLDWyE-mL9hYP1HAL8jVUebPeJ1BqyWEE3yXRlw" id="f9e2b68b-9aa5-4dc8-b9b3-4869f54a6e0b" resource_id="c4e4fbab-14b4-4086-b399-f13f357875aa" resource_status="CREATED"> </video> text sau</p>\n<p>text dưới</p>\n<p>---</p>\n<p>video giữa</p>\n<p style="text-align: center;">trước<video width="346" height="194" poster="/assets/default_thumbnail_video-203s-ZWn.png" id="5a2a111f-352c-4b3c-a345-820a0efbe80c" resource_id="a89724ae-a43c-4d2e-a35b-f0477682041f"> <source src="null" token="eyJhbGciOiJSUzI1NiIsImtpZCI6IjU1M2FhNzhlMDJjOGViZTcxYjQzMzVlYzI4NTBmNzY2In0.eyJzdWIiOiJmOGY0YTM2YjFiMGJkNzFjYzEyZjM5ZjVhNDNjMTU5NCIsImtpZCI6IjU1M2FhNzhlMDJjOGViZTcxYjQzMzVlYzI4NTBmNzY2IiwiZXhwIjoxNzcwNDA5MDcyfQ.fskdA7pkYR2BAefEMffm6xX76-psHBtN_oiA8rfUwwu4-HHDiBPOba9PNLkdfichXZ9X0io5QZ6UVe6dyabwyBehZoreu_LYL4PqgeMTHV5fdKYkoxj6AvPhzwCN6SnhuFUrXMEwwHDg0SA_LpUQetic6us2utgkl1odlb4fuAY54rLX6hieZMpDNSB-vj1xh5ShzsfOc9g8QF3BNSH18N5OFRsHPzU9AFn5k2JrnBxAxcyvS6m3mapVkogUBwDRaUbARD0Y4kQFJYu0R47sKCa4wSyPc24KAvjwrICwpuvrsFvIASRdXXiBn_1SjbmDybJ6OKCQt9YfkRMaskhjTQ" id="fae09494-081b-4117-a262-fd2a3328a1c5" resource_id="a89724ae-a43c-4d2e-a35b-f0477682041f" resource_status="ERROR"> </video>&nbsp;sau</p>\n<p style="text-align: left;">---</p>\n<p style="text-align: left;">video phải</p>\n<p style="text-align: right;">trước <video width="120" height="67" poster="/assets/default_thumbnail_video-203s-ZWn.png" id="59d9912b-f585-41e3-872b-6f0b28d8ed89" resource_id="3733f459-6c96-48e6-a6f3-c19046dc2f44"> <source src="null" token="eyJhbGciOiJSUzI1NiIsImtpZCI6IjU1M2FhNzhlMDJjOGViZTcxYjQzMzVlYzI4NTBmNzY2In0.eyJzdWIiOiI4MTFlODU1YjQwZTg3M2RiNGUzMTg3MTg2YTE0ZTYyOCIsImtpZCI6IjU1M2FhNzhlMDJjOGViZTcxYjQzMzVlYzI4NTBmNzY2IiwiZXhwIjoxNzcwNDA5MDcyfQ.vg_WIXbHa3sZYsX9UJ0cncZ2YgfJdR7cnKDNOzBXBwodbAXzhM-iD78G-O5nFnYIyzqg8llwjFALz7oqAJu87aZmQ_E9mZWkzGrS2xS6-6NWx6vN1j3TapvQ4-LoFEoiVpJCfHXZtcPg2ktCF-wNodYVItQl--7uecvBeA3hUDlLGFH0PSShkjmNgOaf61I1-qXkR8Sgt4061MLDBpg65oP8yIH0CAjAB2yjP8fs7S0O0tZEgJ3fMscO0Xqk9ssoCxV26lLjae2aSUP0uEY1k-xSOWMeP5vgsuNUWL6CFoz3l-MKBCCtnoFVkjtLmlrarzyBo39CELCYEKYfFww_yQ" id="a553c0e7-cf8b-4b38-8d30-161658ce3dc1" resource_id="3733f459-6c96-48e6-a6f3-c19046dc2f44" resource_status="ERROR"> </video>sau</p>\n<p style="text-align: right;">&nbsp;</p>\n<table style="border-color: rgb(209, 213, 219); border-radius: 8px; border-collapse: separate; border-spacing: 0px; overflow: hidden; height: 552px; width: 101.506%;" border="1"><colgroup><col style="width: 16.5068%;"><col style="width: 60.6927%;"><col style="width: 22.8005%;"></colgroup>\n<tbody>\n<tr>\n<td><img id="156eb891-d39c-4a99-b770-71de63a728fb" resource_id="fce5be90-2024-4799-b5ba-ee6c837b046a" title="b54fc0fc3bd8a5775a08061ee30843a1.jpg" src="https://cdn-staging.sapp.edu.vn/temp/1764925918416_b54fc0fc3bd8a5775a08061ee30843a1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20260206%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20260206T081752Z&X-Amz-Expires=3600&X-Amz-Signature=f4269087dae4411737d4cc2f4841dd80b38faf84831fcf2ae08da683aac0bccf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" width="200"></td>\n<td>&nbsp;</td>\n<td><img src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3eGxsdzdkenR3NDNldmowaDMzZjVueXZmcnlhemo4NGc5eDVkZ3k3OCZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/fS5I4hHyFTu3HnqiZs/giphy.gif" width="68" height="68" style="display: block; margin-left: auto; margin-right: auto;"></td>\n</tr>\n<tr>\n<td>&nbsp;</td>\n<td>&nbsp;</td>\n<td>&nbsp;</td>\n</tr>\n<tr>\n<td>&nbsp;</td>\n<td>&nbsp;</td>\n<td><math xmlns="http://www.w3.org/1998/Math/MathML"><mfenced open="{" close="}"><mfenced open="[" close="]"><mfenced open="|" close="|"><mfenced><mn>123</mn></mfenced></mfenced></mfenced></mfenced><mo>&#215;</mo><mroot><mfrac><mrow><mn>3</mn><mo>+</mo><msqrt><mi>x</mi></msqrt></mrow><msup><mi>y</mi><mn>2</mn></msup></mfrac><mfrac><mn>1</mn><mn>3</mn></mfrac></mroot></math></td>\n</tr>\n</tbody>\n</table>\n<p>&nbsp;</p>\n<p style="text-align: right;"><!--StartFragment--><!-- x-tinymce/html --><math xmlns="http://www.w3.org/1998/Math/MathML"><mfenced open="{" close="}"><mfenced open="[" close="]"><mfenced open="|" close="|"><mfenced><mn>123</mn></mfenced></mfenced></mfenced></mfenced><mo>&#215;</mo><mroot><mfrac><mrow><mn>3</mn><mo>+</mo><msqrt><mi>x</mi></msqrt></mrow><msup><mi>y</mi><mn>2</mn></msup></mfrac><mfrac><mn>1</mn><mn>3</mn></mfrac></mroot></math><!--EndFragment--></p>\n<p><!--StartFragment--><!-- x-tinymce/html --><math xmlns="http://www.w3.org/1998/Math/MathML"><mfenced open="{" close="}"><mfenced open="[" close="]"><mfenced open="|" close="|"><mfenced><mn>123</mn></mfenced></mfenced></mfenced></mfenced><mo>&#215;</mo><mroot><mfrac><mrow><mn>3</mn><mo>+</mo><msqrt><mi>x</mi></msqrt></mrow><msup><mi>y</mi><mn>2</mn></msup></mfrac><mfrac><mn>1</mn><mn>3</mn></mfrac></mroot></math><!--EndFragment--></p>\n<p style="text-align: center;"><!--StartFragment--><!-- x-tinymce/html --><math xmlns="http://www.w3.org/1998/Math/MathML"><mfenced open="{" close="}"><mfenced open="[" close="]"><mfenced open="|" close="|"><mfenced><mn>123</mn></mfenced></mfenced></mfenced></mfenced><mo>&#215;</mo><mroot><mfrac><mrow><mn>3</mn><mo>+</mo><msqrt><mi>x</mi></msqrt></mrow><msup><mi>y</mi><mn>2</mn></msup></mfrac><mfrac><mn>1</mn><mn>3</mn></mfrac></mroot></math><!--EndFragment--></p>\n<p>&nbsp;</p>\n<p style="text-align: right;"><!--StartFragment--><!-- x-tinymce/html --><math xmlns="http://www.w3.org/1998/Math/MathML"><mfenced open="{" close="}"><mfenced open="[" close="]"><mfenced open="|" close="|"><mfenced><mn>123</mn></mfenced></mfenced></mfenced></mfenced><mo>&#215;</mo><mroot><mfrac><mrow><mn>3</mn><mo>+</mo><msqrt><mi>x</mi></msqrt></mrow><msup><mi>y</mi><mn>2</mn></msup></mfrac><mfrac><mn>1</mn><mn>3</mn></mfrac></mroot></math><!--EndFragment--></p>',
          level: 'FUNDAMENTAL' as QUESTION_LEVELS,
          qType: 'ESSAY' as QUESTION_TYPES,
          assignment_type: 'TEXT',
          response_option: 'WORD',
          display_type: 'VERTICAL',
          answer_template:
            '<p>question video</p>\n<p>text tr&ecirc;n</p>\n<p style="text-align: left;">text trước&nbsp;</p>\n<p style="text-align: center;"><img id="fdac4e28-2070-467d-af7e-33e8cf2843d5" resource_id="25f43c78-1d2b-416e-be35-c588cf215764" title="image.png" src="https://cdn-staging.sapp.edu.vn/course/880e00a9-0866-46af-8dc6-baac01cf04af/1764563709661_image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&amp;X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20251212%2Fap-southeast-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20251212T030359Z&amp;X-Amz-Expires=3600&amp;X-Amz-Signature=dce284dcf97ad713fd4ba4d0ccc085ec90d9ceee5cb6550cf9758a6bd302bf28&amp;X-Amz-SignedHeaders=host&amp;x-amz-checksum-mode=ENABLED&amp;x-id=GetObject" width="200"></p>\n<p style="text-align: left;"><img id="6fd618d6-b02a-45cd-8b85-c4caf6b1d81f" resource_id="9a5c4783-2a9d-4550-8599-fa372db8e498" title="IT Org Chart (1).png" src="https://cdn-staging.sapp.edu.vn/1764905335697_IT%20Org%20Chart%20_1_.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&amp;X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20251212%2Fap-southeast-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20251212T030214Z&amp;X-Amz-Expires=3600&amp;X-Amz-Signature=c06e8bc6084a207013b5f6ec1c879cc5ae5c649be62b6841771cc9c9cb408bb3&amp;X-Amz-SignedHeaders=host&amp;x-amz-checksum-mode=ENABLED&amp;x-id=GetObject" width="200"></p>\n<p style="text-align: right;"><img id="c03e3a32-f643-4a89-b64c-ffe3d7d037c5" resource_id="811b360a-784f-42e8-a7a2-cea686b3c8aa" title="Luồng vận h&agrave;nh.jpg" src="https://cdn-staging.sapp.edu.vn/1764905333766_Lu%E1%BB%93ng%20v%E1%BA%ADn%20h%C3%A0nh.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&amp;X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20251212%2Fap-southeast-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20251212T030308Z&amp;X-Amz-Expires=3600&amp;X-Amz-Signature=254cfdde419dd4e9d6d0d5c1eab23b61d0e1fd3c13e2b8b0a32645fb5118cc11&amp;X-Amz-SignedHeaders=host&amp;x-amz-checksum-mode=ENABLED&amp;x-id=GetObject" width="200"></p>\n<p style="text-align: left;"><math xmlns="http://www.w3.org/1998/Math/MathML"><mfenced open="|" close="|"><mrow><mroot><mrow><mi>d</mi><mi>f</mi><mi>g</mi></mrow><mn>2</mn></mroot><mfrac><mrow><mn>2</mn><mo>+</mo><mo>&#160;</mo><mi>x</mi></mrow><mi>r</mi></mfrac></mrow></mfenced></math></p>\n<p style="text-align: center;"><math xmlns="http://www.w3.org/1998/Math/MathML"><mfenced open="[" close="]"><mrow><mn>1</mn><mo>=</mo><mo>&#160;</mo><mroot><mn>11111</mn><mrow><mi>x</mi><mfrac><mrow><mi>s</mi><mi>w</mi><mn>2</mn></mrow><mrow><mi>s</mi><mi>s</mi><mi>s</mi><mi>s</mi><mi>w</mi></mrow></mfrac></mrow></mroot></mrow></mfenced></math></p>\n<p style="text-align: right;"><math xmlns="http://www.w3.org/1998/Math/MathML"><msqrt><mi>x</mi></msqrt><mn>111</mn><mi>e</mi><mi>w</mi></math></p>\n<p style="text-align: left;">&nbsp;</p>',
          question_topic: {
            id: 'a6a00926-58cb-47ca-8de1-8a521b1da736',
            description: '',
            files: [],
            exhibits: [],
            name: '',
            display_type: 'VERTICAL',
            number_of_multiple_choice_questions: 0,
            number_of_essay_questions: 0,
            case_study_name: '',
          },
          answers: [],
          question_matchings: [],
          files: [],
          exhibits: [],
          requirements: [],
          solution: '',
          hint: '',
          time_spent: 0,
        },
        reveal: 'continue',
      },
    ],
  },
  {
    id: 'task-3',
    title: 'Task',
    blocks: [
      {
        id: 'task-3-block-2',
        type: 'text',
        text: '<p>465 True/False</p>\n<p>text abc</p>\n<p><!--StartFragment--><!-- x-tinymce/html --></p>\n<p><strong style="font-weight: bold;">text abc</strong></p>\n<p><span style="text-decoration: underline;">text abc</span></p>\n<p><em style="font-style: italic;">text abc</em> <!--StartFragment--><!-- x-tinymce/html --></p>\n<p><s>text abc</s><!--StartFragment--><!-- x-tinymce/html --></p>\n<p>căn tr&aacute;i</p>\n<p style="text-align: right;">căn phải</p>\n<p style="text-align: center;">căn giữa</p>\n<p><span style="font-size: 20px;">chữ to</span></p>\n<p><span style="font-size: 10px;">chữ nhỏ</span></p>\n<p><span style="font-family: \'book antiqua\', palatino;">kiểu chữ kh&aacute;c</span></p>\n<p><a title="title của hyperlink" href="https://www.google.com/">hyperlink</a></p>\n<ul>\n<li>a</li>\n<li>b</li>\n</ul>\n<ol>\n<li>c</li>\n<li>d</li>\n</ol>\n<p>😃</p>\n<p>$</p>\n<table style="border-color: rgb(209, 213, 219); border-radius: 8px; border-collapse: separate; border-spacing: 0px; overflow: hidden; height: 65px; width: 63.4921%; margin-left: auto; margin-right: auto;" border="1"><colgroup><col style="width: 33.1667%;"><col style="width: 33.1667%;"><col style="width: 33.1667%;"></colgroup>\n<tbody>\n<tr>\n<td>STT</td>\n<td>T&ecirc;n</td>\n<td>Tuổi</td>\n</tr>\n<tr>\n<td>1</td>\n<td>Nguyễn Văn A</td>\n<td>10</td>\n</tr>\n</tbody>\n</table>\n<p><img id="8e664f9d-6299-4c49-8b16-73ccd7553472" resource_id="000235bf-ba61-423e-850b-5ae0b75fcb57" title="b54fc0fc3bd8a5775a08061ee30843a1.jpg" src="https://cdn-staging.sapp.edu.vn/temp/1764824512325_b54fc0fc3bd8a5775a08061ee30843a1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20260206%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20260206T082627Z&X-Amz-Expires=3600&X-Amz-Signature=6c77aa774f1a3832be775677dd7f4741983f60d0d4f7b15826a4924f7a483242&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" width="200" style="display: block; margin-left: auto; margin-right: auto;"></p>\n<p><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math></p>\n<p><!--StartFragment--><!-- x-tinymce/html --><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math><!--EndFragment--></p>\n<p><!--StartFragment--><!-- x-tinymce/html --><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math><!--EndFragment--></p>\n<p><math xmlns="http://www.w3.org/1998/Math/MathML" class="wrs_chemistry"><mmultiscripts><mi mathvariant="normal">z</mi><mprescripts></mprescripts><mi mathvariant="normal">y</mi><mi mathvariant="normal">x</mi></mmultiscripts><mo>+</mo><msubsup><mi mathvariant="normal">x</mi><mi mathvariant="normal">z</mi><mi mathvariant="normal">y</mi></msubsup><mspace linebreak="newline"></mspace><mfenced open="[" close="]"><mtable><mtr><mtd><mi mathvariant="normal">x</mi></mtd><mtd><mi mathvariant="normal">y</mi></mtd></mtr><mtr><mtd><mi mathvariant="normal">z</mi></mtd><mtd><mi mathvariant="normal">m</mi></mtd></mtr></mtable></mfenced></math></p>',
        reveal: 'auto',
      },
      {
        id: 'task-3-block-3',
        type: 'quiz',
        question: {
          id: '9048451a-4797-487c-a43f-6706d3f1305b',
          key: 'QN000768',
          question_content:
            '<p>465 True/False</p>\n<p>text abc</p>\n<p><!--StartFragment--><!-- x-tinymce/html --></p>\n<p><strong style="font-weight: bold;">text abc</strong></p>\n<p><span style="text-decoration: underline;">text abc</span></p>\n<p><em style="font-style: italic;">text abc</em> <!--StartFragment--><!-- x-tinymce/html --></p>\n<p><s>text abc</s><!--StartFragment--><!-- x-tinymce/html --></p>\n<p>căn tr&aacute;i</p>\n<p style="text-align: right;">căn phải</p>\n<p style="text-align: center;">căn giữa</p>\n<p><span style="font-size: 20px;">chữ to</span></p>\n<p><span style="font-size: 10px;">chữ nhỏ</span></p>\n<p><span style="font-family: \'book antiqua\', palatino;">kiểu chữ kh&aacute;c</span></p>\n<p><a title="title của hyperlink" href="https://www.google.com/">hyperlink</a></p>\n<ul>\n<li>a</li>\n<li>b</li>\n</ul>\n<ol>\n<li>c</li>\n<li>d</li>\n</ol>\n<p>😃</p>\n<p>$</p>\n<table style="border-color: rgb(209, 213, 219); border-radius: 8px; border-collapse: separate; border-spacing: 0px; overflow: hidden; height: 65px; width: 63.4921%; margin-left: auto; margin-right: auto;" border="1"><colgroup><col style="width: 33.1667%;"><col style="width: 33.1667%;"><col style="width: 33.1667%;"></colgroup>\n<tbody>\n<tr>\n<td>STT</td>\n<td>T&ecirc;n</td>\n<td>Tuổi</td>\n</tr>\n<tr>\n<td>1</td>\n<td>Nguyễn Văn A</td>\n<td>10</td>\n</tr>\n</tbody>\n</table>\n<p><img id="8e664f9d-6299-4c49-8b16-73ccd7553472" resource_id="000235bf-ba61-423e-850b-5ae0b75fcb57" title="b54fc0fc3bd8a5775a08061ee30843a1.jpg" src="https://cdn-staging.sapp.edu.vn/temp/1764824512325_b54fc0fc3bd8a5775a08061ee30843a1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20260206%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20260206T082627Z&X-Amz-Expires=3600&X-Amz-Signature=6c77aa774f1a3832be775677dd7f4741983f60d0d4f7b15826a4924f7a483242&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" width="200" style="display: block; margin-left: auto; margin-right: auto;"></p>\n<p><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math></p>\n<p><!--StartFragment--><!-- x-tinymce/html --><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math><!--EndFragment--></p>\n<p><!--StartFragment--><!-- x-tinymce/html --><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math><!--EndFragment--></p>\n<p><math xmlns="http://www.w3.org/1998/Math/MathML" class="wrs_chemistry"><mmultiscripts><mi mathvariant="normal">z</mi><mprescripts></mprescripts><mi mathvariant="normal">y</mi><mi mathvariant="normal">x</mi></mmultiscripts><mo>+</mo><msubsup><mi mathvariant="normal">x</mi><mi mathvariant="normal">z</mi><mi mathvariant="normal">y</mi></msubsup><mspace linebreak="newline"></mspace><mfenced open="[" close="]"><mtable><mtr><mtd><mi mathvariant="normal">x</mi></mtd><mtd><mi mathvariant="normal">y</mi></mtd></mtr><mtr><mtd><mi mathvariant="normal">z</mi></mtd><mtd><mi mathvariant="normal">m</mi></mtd></mtr></mtable></mfenced></math></p>',
          level: 'FUNDAMENTAL',
          qType: 'TRUE_FALSE',
          assignment_type: null,
          response_option: null,
          display_type: 'VERTICAL',
          status: 'BLOCK',
          is_self_reflection: false,
          answer_template: null,
          answer_template_files: [],
          question_topic: {
            id: '03fc595c-7d45-4cf6-beea-4fdd5cb35c15',
            description: null,
            files: [],
            exhibits: [],
          },
          answers: [
            {
              id: '770f45fd-b347-4cb5-8b20-00f91a257d32',
              answer: 'Đây là đáp án sai',
              answer_position: 1,
            },
            {
              id: '87db62a1-e5b8-4a84-b534-689edc718eb8',
              answer: 'Đây là đáp án đúng',
              answer_position: 2,
            },
          ],
          question_matchings: [],
          files: [],
          exhibits: [],
          requirements: [],
        } as unknown as IQuestion,
        reveal: 'continue',
      },
    ],
  },
  {
    id: 'task-4',
    title: 'Task',
    blocks: [
      {
        id: 'task-4-block-2',
        type: 'text',
        text: '<p>466 One Choice</p>\n<ul>\n<li>text abc&nbsp;<span id="20dbb656-0608-441d-a66f-22b8baeb13a1" class="question-content-tag" contenteditable="false">[_______]</span><!--StartFragment--><!-- x-tinymce/html --></li>\n<li><strong style="font-weight: bold;">text abc <span id="84d56d87-102a-4563-9d1e-8ff53d7bef7a" class="question-content-tag" contenteditable="false">[_______]</span></strong></li>\n</ul>\n<ol>\n<li><span style="text-decoration: underline;">text abc</span></li>\n<li><em style="font-style: italic;">text abc</em> <!--StartFragment--><!-- x-tinymce/html --></li>\n</ol>\n<p style="line-height: 2; padding-left: 160px;"><s>text abc</s><!--StartFragment--><!-- x-tinymce/html --></p>\n<p>căn tr&aacute;i</p>\n<p style="text-align: right;">căn phải</p>\n<p style="text-align: center;">căn giữa</p>\n<p><span style="font-size: 20px;">chữ to</span></p>\n<p><span style="font-size: 10px;">chữ nhỏ</span></p>\n<p><span style="font-family: \'book antiqua\', palatino;">kiểu chữ kh&aacute;c</span></p>\n<p><a title="title của hyperlink (tooltip)" href="https://www.google.com/" target="_blank" rel="noopener">đ&acirc;y l&agrave; hyperlink</a></p>\n<ul>\n<li style="text-align: right;">a</li>\n<li style="text-align: right;">b</li>\n</ul>\n<ol>\n<li style="text-align: center;">c</li>\n<li style="text-align: center;">d</li>\n</ol>\n<p>😃</p>\n<p>$</p>\n<table style="border-color: rgb(209, 213, 219); border-radius: 8px; border-collapse: separate; border-spacing: 0px; overflow: hidden; height: 160px; width: 60.5159%; margin-left: auto; margin-right: auto;" border="1"><colgroup><col style="width: 8.77743%;"><col style="width: 57.9937%;"><col style="width: 33.2288%;"></colgroup>\n<tbody>\n<tr>\n<td>STT</td>\n<td style="text-align: center;">T&ecirc;n</td>\n<td style="text-align: right;">Tuổi</td>\n</tr>\n<tr>\n<td>1</td>\n<td style="text-align: center; line-height: 1;">Nguyễn Văn A<span id="2d0b9628-3ad6-45b6-ba63-eaa3e399fd19" class="question-content-tag" contenteditable="false">[_______]</span></td>\n<td style="text-align: right;">10</td>\n</tr>\n</tbody>\n</table>\n<p><img id="8e664f9d-6299-4c49-8b16-73ccd7553472" resource_id="000235bf-ba61-423e-850b-5ae0b75fcb57" title="b54fc0fc3bd8a5775a08061ee30843a1.jpg" src="https://cdn-staging.sapp.edu.vn/temp/1764824512325_b54fc0fc3bd8a5775a08061ee30843a1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20260206%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20260206T083002Z&X-Amz-Expires=3600&X-Amz-Signature=e0f4b1a9de39d6e5fc89f0eda5153270afc0a5942e64a5a0fc837b55bd92eb01&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" width="200" style="display: block; margin-left: auto; margin-right: auto;"></p>\n<p><img id="3278091d-9fac-4554-a814-44a382a02eb9" resource_id="a396139d-7013-4186-a6a1-b3b30589ac78" title="b54fc0fc3bd8a5775a08061ee30843a1.jpg" src="https://cdn-staging.sapp.edu.vn/course/60afd88b-2503-4851-aabe-c6cbd663dd44/1764838419939_b54fc0fc3bd8a5775a08061ee30843a1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20260206%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20260206T083002Z&X-Amz-Expires=3600&X-Amz-Signature=ed50f8d3a2972054526490c996ae9c7842f6174f8583d66bbba172544d9e2ae3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" width="851" height="851" style="float: right;"></p>\n<p><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math></p>\n<p><!--StartFragment--><!-- x-tinymce/html --><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math><!--EndFragment--></p>\n<p style="text-align: right;"><!--StartFragment--><!-- x-tinymce/html --><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math><span id="da01ed4b-b2c3-49f4-a1d5-076eeaec480c" class="question-content-tag" contenteditable="false">[_______]</span><!--EndFragment--></p>\n<p><math xmlns="http://www.w3.org/1998/Math/MathML" class="wrs_chemistry"><mmultiscripts><mi mathvariant="normal">z</mi><mprescripts></mprescripts><mi mathvariant="normal">y</mi><mi mathvariant="normal">x</mi></mmultiscripts><mo>+</mo><msubsup><mi mathvariant="normal">x</mi><mi mathvariant="normal">z</mi><mi mathvariant="normal">y</mi></msubsup><mspace linebreak="newline"></mspace><mfenced open="[" close="]"><mtable><mtr><mtd><mi mathvariant="normal">x</mi></mtd><mtd><mi mathvariant="normal">y</mi></mtd></mtr><mtr><mtd><mi mathvariant="normal">z</mi></mtd><mtd><mi mathvariant="normal">m</mi></mtd></mtr></mtable></mfenced></math></p>',
        reveal: 'auto',
      },
      {
        id: 'task-3-block-3',
        type: QUESTION_TYPES.ONE_CHOICE,
        question: {
          id: 'be1af29c-de3b-4552-a1ca-640f1008ec42',
          key: 'QN000769',
          question_content:
            '<p>466 One Choice</p>\n<ul>\n<li>text abc&nbsp;<span id="20dbb656-0608-441d-a66f-22b8baeb13a1" class="question-content-tag" contenteditable="false">[_______]</span><!--StartFragment--><!-- x-tinymce/html --></li>\n<li><strong style="font-weight: bold;">text abc <span id="84d56d87-102a-4563-9d1e-8ff53d7bef7a" class="question-content-tag" contenteditable="false">[_______]</span></strong></li>\n</ul>\n<ol>\n<li><span style="text-decoration: underline;">text abc</span></li>\n<li><em style="font-style: italic;">text abc</em> <!--StartFragment--><!-- x-tinymce/html --></li>\n</ol>\n<p style="line-height: 2; padding-left: 160px;"><s>text abc</s><!--StartFragment--><!-- x-tinymce/html --></p>\n<p>căn tr&aacute;i</p>\n<p style="text-align: right;">căn phải</p>\n<p style="text-align: center;">căn giữa</p>\n<p><span style="font-size: 20px;">chữ to</span></p>\n<p><span style="font-size: 10px;">chữ nhỏ</span></p>\n<p><span style="font-family: \'book antiqua\', palatino;">kiểu chữ kh&aacute;c</span></p>\n<p><a title="title của hyperlink (tooltip)" href="https://www.google.com/" target="_blank" rel="noopener">đ&acirc;y l&agrave; hyperlink</a></p>\n<ul>\n<li style="text-align: right;">a</li>\n<li style="text-align: right;">b</li>\n</ul>\n<ol>\n<li style="text-align: center;">c</li>\n<li style="text-align: center;">d</li>\n</ol>\n<p>😃</p>\n<p>$</p>\n<table style="border-color: rgb(209, 213, 219); border-radius: 8px; border-collapse: separate; border-spacing: 0px; overflow: hidden; height: 160px; width: 60.5159%; margin-left: auto; margin-right: auto;" border="1"><colgroup><col style="width: 8.77743%;"><col style="width: 57.9937%;"><col style="width: 33.2288%;"></colgroup>\n<tbody>\n<tr>\n<td>STT</td>\n<td style="text-align: center;">T&ecirc;n</td>\n<td style="text-align: right;">Tuổi</td>\n</tr>\n<tr>\n<td>1</td>\n<td style="text-align: center; line-height: 1;">Nguyễn Văn A<span id="2d0b9628-3ad6-45b6-ba63-eaa3e399fd19" class="question-content-tag" contenteditable="false">[_______]</span></td>\n<td style="text-align: right;">10</td>\n</tr>\n</tbody>\n</table>\n<p><img id="8e664f9d-6299-4c49-8b16-73ccd7553472" resource_id="000235bf-ba61-423e-850b-5ae0b75fcb57" title="b54fc0fc3bd8a5775a08061ee30843a1.jpg" src="https://cdn-staging.sapp.edu.vn/temp/1764824512325_b54fc0fc3bd8a5775a08061ee30843a1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20260206%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20260206T083002Z&X-Amz-Expires=3600&X-Amz-Signature=e0f4b1a9de39d6e5fc89f0eda5153270afc0a5942e64a5a0fc837b55bd92eb01&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" width="200" style="display: block; margin-left: auto; margin-right: auto;"></p>\n<p><img id="3278091d-9fac-4554-a814-44a382a02eb9" resource_id="a396139d-7013-4186-a6a1-b3b30589ac78" title="b54fc0fc3bd8a5775a08061ee30843a1.jpg" src="https://cdn-staging.sapp.edu.vn/course/60afd88b-2503-4851-aabe-c6cbd663dd44/1764838419939_b54fc0fc3bd8a5775a08061ee30843a1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20260206%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20260206T083002Z&X-Amz-Expires=3600&X-Amz-Signature=ed50f8d3a2972054526490c996ae9c7842f6174f8583d66bbba172544d9e2ae3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" width="851" height="851" style="float: right;"></p>\n<p><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math></p>\n<p><!--StartFragment--><!-- x-tinymce/html --><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math><!--EndFragment--></p>\n<p style="text-align: right;"><!--StartFragment--><!-- x-tinymce/html --><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math><span id="da01ed4b-b2c3-49f4-a1d5-076eeaec480c" class="question-content-tag" contenteditable="false">[_______]</span><!--EndFragment--></p>\n<p><math xmlns="http://www.w3.org/1998/Math/MathML" class="wrs_chemistry"><mmultiscripts><mi mathvariant="normal">z</mi><mprescripts></mprescripts><mi mathvariant="normal">y</mi><mi mathvariant="normal">x</mi></mmultiscripts><mo>+</mo><msubsup><mi mathvariant="normal">x</mi><mi mathvariant="normal">z</mi><mi mathvariant="normal">y</mi></msubsup><mspace linebreak="newline"></mspace><mfenced open="[" close="]"><mtable><mtr><mtd><mi mathvariant="normal">x</mi></mtd><mtd><mi mathvariant="normal">y</mi></mtd></mtr><mtr><mtd><mi mathvariant="normal">z</mi></mtd><mtd><mi mathvariant="normal">m</mi></mtd></mtr></mtable></mfenced></math></p>',
          level: 'FUNDAMENTAL',
          qType: 'ONE_CHOICE',
          assignment_type: null,
          response_option: null,
          display_type: 'VERTICAL',
          status: 'BLOCK',
          is_self_reflection: false,
          answer_template: null,
          answer_template_files: [],
          question_topic: {
            id: 'a1abde7e-8f2f-49b5-a75d-cde31fe9d235',
            description: null,
            files: [],
            exhibits: [],
          },
          answers: [
            {
              id: '50e51871-2432-462a-b89e-9bd5b46da168',
              answer: 'Đây là đáp án sai',
              answer_position: 1,
            },
            {
              id: '9fc07699-61a6-4e92-8cb2-f59cf276c1ac',
              answer: 'Đây là đáp án đúng',
              answer_position: 2,
            },
            {
              id: 'de611fa6-2c0f-4c37-963d-1a3a122585eb',
              answer: 'Đây là đáp án sai',
              answer_position: 3,
            },
          ],
          question_matchings: [],
          files: [],
          exhibits: [],
          requirements: [],
        } as unknown as IQuestion,
        reveal: 'continue',
      },
    ],
  },
  {
    id: 'task-5',
    title: 'Task',
    blocks: [
      {
        id: 'task-4-block-2',
        type: 'text',
        text: 'Multiple choice',
        reveal: 'auto',
      },
      {
        id: 'task-3-block-3',
        type: 'quiz',
        question: {
          id: '67465670-a2ee-44ab-9779-974c0d598e54',
          key: 'QN000770',
          question_content:
            '<p>467 Multiple choice</p>\n<ul>\n<li>text abc&nbsp;<span id="20dbb656-0608-441d-a66f-22b8baeb13a1" class="question-content-tag" contenteditable="false">[_______]</span><!--StartFragment--><!-- x-tinymce/html --></li>\n<li><strong style="font-weight: bold;">text abc <span id="84d56d87-102a-4563-9d1e-8ff53d7bef7a" class="question-content-tag" contenteditable="false">[_______]</span></strong></li>\n</ul>\n<ol>\n<li><span style="text-decoration: underline;">text abc</span></li>\n<li><em style="font-style: italic;">text abc</em> <!--StartFragment--><!-- x-tinymce/html --></li>\n</ol>\n<p style="line-height: 2; padding-left: 160px;"><s>text abc</s><!--StartFragment--><!-- x-tinymce/html --></p>\n<p>căn tr&aacute;i</p>\n<p style="text-align: right;">căn phải</p>\n<p style="text-align: center;">căn giữa</p>\n<p><span style="font-size: 20px;">chữ to</span></p>\n<p><span style="font-size: 10px;">chữ nhỏ</span></p>\n<p><span style="font-family: \'book antiqua\', palatino;">kiểu chữ kh&aacute;c</span></p>\n<p><a title="title của hyperlink (tooltip)" href="https://www.google.com/" target="_blank" rel="noopener">đ&acirc;y l&agrave; hyperlink</a></p>\n<ul>\n<li style="text-align: right;">a</li>\n<li style="text-align: right;">b</li>\n</ul>\n<ol>\n<li style="text-align: center;">c</li>\n<li style="text-align: center;">d</li>\n</ol>\n<p>😃</p>\n<p>$</p>\n<table style="border-color: rgb(209, 213, 219); border-radius: 8px; border-collapse: separate; border-spacing: 0px; overflow: hidden; height: 160px; width: 60.5159%; margin-left: auto; margin-right: auto;" border="1"><colgroup><col style="width: 8.77743%;"><col style="width: 57.9937%;"><col style="width: 33.2288%;"></colgroup>\n<tbody>\n<tr>\n<td>STT</td>\n<td style="text-align: center;">T&ecirc;n</td>\n<td style="text-align: right;"><span id="2dff437c-866e-4dfa-b224-f6b59904b021" class="question-content-tag" contenteditable="false">[_______]</span>Tuổi</td>\n</tr>\n<tr>\n<td>1</td>\n<td style="text-align: center; line-height: 1;">Nguyễn Văn A<span id="400b948e-c725-43ba-9f49-cc6d142b8f80" class="question-content-tag" contenteditable="false">[_______]</span></td>\n<td style="text-align: right;">10</td>\n</tr>\n</tbody>\n</table>\n<p><img id="8e664f9d-6299-4c49-8b16-73ccd7553472" resource_id="000235bf-ba61-423e-850b-5ae0b75fcb57" title="b54fc0fc3bd8a5775a08061ee30843a1.jpg" src="https://cdn-staging.sapp.edu.vn/temp/1764824512325_b54fc0fc3bd8a5775a08061ee30843a1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20260206%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20260206T083146Z&X-Amz-Expires=3600&X-Amz-Signature=b71cd8be73feda70f9885c5b5c39685f1624208a0b59b2d361bb3cd385e92cca&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" width="200" style="display: block; margin-left: auto; margin-right: auto;"></p>\n<p><img id="3278091d-9fac-4554-a814-44a382a02eb9" resource_id="a396139d-7013-4186-a6a1-b3b30589ac78" title="b54fc0fc3bd8a5775a08061ee30843a1.jpg" src="https://cdn-staging.sapp.edu.vn/course/60afd88b-2503-4851-aabe-c6cbd663dd44/1764838419939_b54fc0fc3bd8a5775a08061ee30843a1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20260206%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20260206T083146Z&X-Amz-Expires=3600&X-Amz-Signature=985f6ed73010caa821c0a3c68808b3ff019a19e0dd614e58b6c301e65cc6d35f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" width="851" height="851" style="float: right;"></p>\n<p><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math></p>\n<p><!--StartFragment--><!-- x-tinymce/html --><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math><!--EndFragment--></p>\n<p style="text-align: right;"><!--StartFragment--><!-- x-tinymce/html --><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math><span id="cd47f2f7-3cf5-4788-964f-2e4a45efd41f" class="question-content-tag" contenteditable="false">[_______]</span><!--EndFragment--></p>\n<p><math xmlns="http://www.w3.org/1998/Math/MathML" class="wrs_chemistry"><mmultiscripts><mi mathvariant="normal">z</mi><mprescripts></mprescripts><mi mathvariant="normal">y</mi><mi mathvariant="normal">x</mi></mmultiscripts><mo>+</mo><msubsup><mi mathvariant="normal">x</mi><mi mathvariant="normal">z</mi><mi mathvariant="normal">y</mi></msubsup><mspace linebreak="newline"></mspace><mfenced open="[" close="]"><mtable><mtr><mtd><mi mathvariant="normal">x</mi></mtd><mtd><mi mathvariant="normal">y</mi></mtd></mtr><mtr><mtd><mi mathvariant="normal">z</mi></mtd><mtd><mi mathvariant="normal">m</mi></mtd></mtr></mtable></mfenced></math></p>',
          level: 'FUNDAMENTAL',
          qType: 'MULTIPLE_CHOICE',
          assignment_type: null,
          response_option: null,
          display_type: 'VERTICAL',
          status: 'BLOCK',
          is_self_reflection: false,
          answer_template: null,
          answer_template_files: [],
          question_topic: {
            id: '4156239e-c27e-4d4c-89a7-a56a44b7379f',
            description: null,
            files: [],
            exhibits: [],
          },
          answers: [
            {
              id: '7b849fb4-f639-4695-89d5-6d7432bb4428',
              answer: 'Đây là đáp án sai',
              answer_position: 1,
            },
            {
              id: '140657be-3ffb-4986-b6d1-283a386a3e93',
              answer: 'Đây là đáp án đúng',
              answer_position: 2,
            },
            {
              id: 'b73a750b-d306-48bf-b928-7b61fdbaf297',
              answer: 'Đây là đáp án đúng',
              answer_position: 3,
            },
          ],
          question_matchings: [],
          files: [],
          exhibits: [],
          requirements: [],
        } as unknown as IQuestion,
        reveal: 'continue',
      },
    ],
  },
  {
    id: 'task-6',
    title: 'Task',
    blocks: [
      {
        id: 'task-6-block-2',
        type: 'text',
        text: 'Matching',
        reveal: 'auto',
      },
      {
        id: 'task-6-block-3',
        type: 'quiz',
        question: {
          id: 'd68234e7-013c-41b9-b77e-3e67ee63c0a4',
          key: 'QN000771',
          question_content:
            '<p>468 Matching</p>\n<ul>\n<li>text abc&nbsp;<span id="20dbb656-0608-441d-a66f-22b8baeb13a1" class="question-content-tag" contenteditable="false">[_______]</span><!--StartFragment--><!-- x-tinymce/html --></li>\n<li><strong style="font-weight: bold;">text abc <span id="84d56d87-102a-4563-9d1e-8ff53d7bef7a" class="question-content-tag" contenteditable="false">[_______]</span></strong></li>\n</ul>\n<ol>\n<li><span style="text-decoration: underline;">text abc</span></li>\n<li><em style="font-style: italic;">text abc</em> <!--StartFragment--><!-- x-tinymce/html --></li>\n</ol>\n<p style="line-height: 2; padding-left: 160px;"><s>text abc</s><!--StartFragment--><!-- x-tinymce/html --></p>\n<p>căn tr&aacute;i</p>\n<p style="text-align: right;">căn phải</p>\n<p style="text-align: center;">căn giữa</p>\n<p><span style="font-size: 20px;">chữ to</span></p>\n<p><span style="font-size: 10px;">chữ nhỏ</span></p>\n<p><span style="font-family: \'book antiqua\', palatino;">kiểu chữ kh&aacute;c</span></p>\n<p><a title="title của hyperlink (tooltip)" href="https://www.google.com/" target="_blank" rel="noopener">đ&acirc;y l&agrave; hyperlink</a></p>\n<ul>\n<li style="text-align: right;">a</li>\n<li style="text-align: right;">b</li>\n</ul>\n<ol>\n<li style="text-align: center;">c</li>\n<li style="text-align: center;">d</li>\n</ol>\n<p>😃</p>\n<p>$</p>\n<table style="border-color: rgb(209, 213, 219); border-radius: 8px; border-collapse: separate; border-spacing: 0px; overflow: hidden; height: 160px; width: 60.5159%; margin-left: auto; margin-right: auto;" border="1"><colgroup><col style="width: 8.77743%;"><col style="width: 57.9937%;"><col style="width: 33.2288%;"></colgroup>\n<tbody>\n<tr>\n<td>STT</td>\n<td style="text-align: center;">T&ecirc;n</td>\n<td style="text-align: right;">Tuổi</td>\n</tr>\n<tr>\n<td>1</td>\n<td style="text-align: center; line-height: 1;">Nguyễn Văn A<span id="39f72e74-f5cd-412d-9168-56a50e9afbba" class="question-content-tag" contenteditable="false">[_______]</span></td>\n<td style="text-align: right;"><span id="f82170b8-d675-4883-9d11-73531b149b72" class="question-content-tag" contenteditable="false">[_______]</span>10</td>\n</tr>\n</tbody>\n</table>\n<p><img id="8e664f9d-6299-4c49-8b16-73ccd7553472" resource_id="000235bf-ba61-423e-850b-5ae0b75fcb57" title="b54fc0fc3bd8a5775a08061ee30843a1.jpg" src="https://cdn-staging.sapp.edu.vn/temp/1764824512325_b54fc0fc3bd8a5775a08061ee30843a1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20260206%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20260206T083513Z&X-Amz-Expires=3600&X-Amz-Signature=727770c25aa9220e1c5627d282b66d33581756b300314c65df0e6ed0fd810e5f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" width="200" style="display: block; margin-left: auto; margin-right: auto;"></p>\n<p><img id="3278091d-9fac-4554-a814-44a382a02eb9" resource_id="a396139d-7013-4186-a6a1-b3b30589ac78" title="b54fc0fc3bd8a5775a08061ee30843a1.jpg" src="https://cdn-staging.sapp.edu.vn/course/60afd88b-2503-4851-aabe-c6cbd663dd44/1764838419939_b54fc0fc3bd8a5775a08061ee30843a1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20260206%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20260206T083513Z&X-Amz-Expires=3600&X-Amz-Signature=baf733e5da110857d0fca4dcb2b7799fbfa6515c82dfb8ae69a840d05c2ecbea&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" width="851" height="851" style="float: right;"></p>\n<p><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math></p>\n<p style="text-align: center;"><!--StartFragment--><!-- x-tinymce/html --><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math><!--EndFragment--></p>\n<p style="text-align: right;"><!--StartFragment--><!-- x-tinymce/html --><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math><span id="c7adc7cf-5b11-43bc-900a-567c53f334d0" class="question-content-tag" contenteditable="false">[_______]</span><!--EndFragment--></p>\n<p><math xmlns="http://www.w3.org/1998/Math/MathML" class="wrs_chemistry"><mmultiscripts><mi mathvariant="normal">z</mi><mprescripts></mprescripts><mi mathvariant="normal">y</mi><mi mathvariant="normal">x</mi></mmultiscripts><mo>+</mo><msubsup><mi mathvariant="normal">x</mi><mi mathvariant="normal">z</mi><mi mathvariant="normal">y</mi></msubsup><mspace linebreak="newline"></mspace><mfenced open="[" close="]"><mtable><mtr><mtd><mi mathvariant="normal">x</mi></mtd><mtd><mi mathvariant="normal">y</mi></mtd></mtr><mtr><mtd><mi mathvariant="normal">z</mi></mtd><mtd><mi mathvariant="normal">m</mi></mtd></mtr></mtable></mfenced></math></p>',
          level: 'FUNDAMENTAL',
          qType: 'MATCHING',
          assignment_type: null,
          response_option: null,
          display_type: 'HORIZONTAL',
          status: 'BLOCK',
          is_self_reflection: false,
          answer_template: null,
          answer_template_files: [],
          question_topic: {
            id: '3c727ed4-2bd4-4444-8370-dae35fc7d568',
            description: null,
            files: [],
            exhibits: [],
          },
          answers: [
            {
              id: 'bfdf7609-8b5e-42e1-b864-d8a204ad9e6d',
              answer: '2',
              answer_position: 1,
            },
            {
              id: '5742e321-4b1d-45d0-ad75-fc15e1ef9e96',
              answer: '1',
              answer_position: 3,
            },
            {
              id: '5f12702c-bf23-4dd6-90f7-17b64af0e957',
              answer: '3',
              answer_position: 2,
            },
          ],
          question_matchings: [
            {
              id: '89fe96a0-e360-46a6-a89c-0918fc932f0b',
              content: '1',
            },
            {
              id: '329a20a8-d947-450c-8376-9b1fee68cab8',
              content: '2',
            },
            {
              id: 'd9112d6f-9af1-4ff5-909a-6c70097dd372',
              content: '3',
            },
          ],
          files: [],
          exhibits: [],
          requirements: [],
        } as unknown as IQuestion,
        reveal: 'continue',
      },
    ],
  },
  {
    id: 'task-7',
    title: 'Task',
    blocks: [
      {
        id: 'task-7-block-2',
        type: 'text',
        text: 'Select word',
        reveal: 'auto',
      },
      {
        id: 'task-7-block-3',
        type: 'quiz',
        question: {
          id: '7434768d-6e52-4bc9-ad86-da2cd116b8f2',
          key: 'QN000772',
          question_content:
            '<p>Select word</p>\n<ul>\n<li>text abc&nbsp;<span id="20dbb656-0608-441d-a66f-22b8baeb13a1" class="question-content-tag" contenteditable="false">[_______]</span><!--StartFragment--><!-- x-tinymce/html --></li>\n<li><strong style="font-weight: bold;">text abc <span id="84d56d87-102a-4563-9d1e-8ff53d7bef7a" class="question-content-tag" contenteditable="false">[_______]</span></strong></li>\n</ul>\n<ol>\n<li><span style="text-decoration: underline;">text abc</span></li>\n<li><em style="font-style: italic;">text abc</em> <!--StartFragment--><!-- x-tinymce/html --></li>\n</ol>\n<p style="line-height: 2; padding-left: 160px;"><s>text abc</s><!--StartFragment--><!-- x-tinymce/html --></p>\n<p>căn tr&aacute;i</p>\n<p style="text-align: right;">căn phải<span id="41c41e01-c839-456c-9b4b-023be26e5276" class="question-content-tag" contenteditable="false">[_______]</span></p>\n<p style="text-align: center;"><span id="0d9bbf64-b2f3-41d2-b8f4-470026e31fe7" class="question-content-tag" contenteditable="false">[_______]</span>căn giữa</p>\n<p><span style="font-size: 20px;"><span id="34e65523-a5b5-40d7-b80d-2956d5e56497" class="question-content-tag" contenteditable="false">[_______]</span><span style="font-size: 36px;">chữ to</span><span id="f725b360-139d-41dc-acc8-bc43a97e5b40" class="question-content-tag" contenteditable="false">[_______]</span></span></p>\n<p><span style="font-size: 10px;">chữ nhỏ</span></p>\n<p><span style="font-family: \'book antiqua\', palatino;">kiểu chữ kh&aacute;c</span></p>\n<p><a title="title của hyperlink (tooltip)" href="https://www.google.com/" target="_blank" rel="noopener">đ&acirc;y l&agrave; hyperlink</a></p>\n<ul>\n<li style="text-align: right;">a</li>\n<li style="text-align: right;">b</li>\n</ul>\n<ol>\n<li style="text-align: center;">c</li>\n<li style="text-align: center;">d</li>\n</ol>\n<p>😃</p>\n<p>$</p>\n<table style="border-color: rgb(209, 213, 219); border-radius: 8px; border-collapse: separate; border-spacing: 0px; overflow: hidden; height: 160px; width: 94.2284%; margin-left: auto; margin-right: auto;" border="1"><colgroup><col style="width: 9.74633%;"><col style="width: 41.2607%;"><col style="width: 48.993%;"></colgroup>\n<tbody>\n<tr>\n<td>STT</td>\n<td style="text-align: center;">T&ecirc;n</td>\n<td style="text-align: right;">Tuổi</td>\n</tr>\n<tr>\n<td>1</td>\n<td style="text-align: center; line-height: 1;">Nguyễn Văn A<span id="a55df4f6-0d1d-4196-9ae4-cc8252ba54fb" class="question-content-tag" contenteditable="false">[_______]</span></td>\n<td style="text-align: left;">\n<p><span id="da0404fc-c0e1-45d4-89b5-5d8cb9bc9aee" class="question-content-tag" contenteditable="false">[_______]</span>10</p>\n<p style="text-align: right;"><span id="9c83b1f9-e1ae-41dd-a064-44dba792dfab" class="question-content-tag" contenteditable="false">[_______]</span>20</p>\n<p style="text-align: center;">30<span id="99026361-c5bd-4301-ba29-322eb63dc9c8" class="question-content-tag" contenteditable="false">[_______]</span></p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><img id="8e664f9d-6299-4c49-8b16-73ccd7553472" resource_id="000235bf-ba61-423e-850b-5ae0b75fcb57" title="b54fc0fc3bd8a5775a08061ee30843a1.jpg" src="https://cdn-staging.sapp.edu.vn/temp/1764824512325_b54fc0fc3bd8a5775a08061ee30843a1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20260206%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20260206T083626Z&X-Amz-Expires=3600&X-Amz-Signature=c013ca814ab581a64535024ac15a1c1ace20a2f1f3dfcb0beed0110f68cc924e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" width="200" style="display: block; margin-left: auto; margin-right: auto;"></p>\n<p><img id="3278091d-9fac-4554-a814-44a382a02eb9" resource_id="a396139d-7013-4186-a6a1-b3b30589ac78" title="b54fc0fc3bd8a5775a08061ee30843a1.jpg" src="https://cdn-staging.sapp.edu.vn/course/60afd88b-2503-4851-aabe-c6cbd663dd44/1764838419939_b54fc0fc3bd8a5775a08061ee30843a1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20260206%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20260206T083626Z&X-Amz-Expires=3600&X-Amz-Signature=6f47cfebd2e48680ad459f765abe84a236f34fdeeaaac82bc15726d407031973&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" width="851" height="851" style="float: right;"></p>\n<p><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math></p>\n<p><!--StartFragment--><!-- x-tinymce/html --><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math><!--EndFragment--></p>\n<p style="text-align: right;"><!--StartFragment--><!-- x-tinymce/html --><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math><span id="e1996194-0e79-41cf-abf3-4a7384ed0489" class="question-content-tag" contenteditable="false">[_______]</span><!--EndFragment--></p>\n<p><math xmlns="http://www.w3.org/1998/Math/MathML" class="wrs_chemistry"><mmultiscripts><mi mathvariant="normal">z</mi><mprescripts></mprescripts><mi mathvariant="normal">y</mi><mi mathvariant="normal">x</mi></mmultiscripts><mo>+</mo><msubsup><mi mathvariant="normal">x</mi><mi mathvariant="normal">z</mi><mi mathvariant="normal">y</mi></msubsup><mspace linebreak="newline"></mspace><mfenced open="[" close="]"><mtable><mtr><mtd><mi mathvariant="normal">x</mi></mtd><mtd><mi mathvariant="normal">y</mi></mtd></mtr><mtr><mtd><mi mathvariant="normal">z</mi></mtd><mtd><mi mathvariant="normal">m</mi></mtd></mtr></mtable></mfenced></math></p>',
          level: 'FUNDAMENTAL',
          qType: 'SELECT_WORD',
          assignment_type: null,
          response_option: null,
          display_type: 'HORIZONTAL',
          status: 'BLOCK',
          is_self_reflection: false,
          answer_template: null,
          answer_template_files: [],
          question_topic: {
            id: 'f3875a3d-f847-4e9e-a79b-273320b969b6',
            description: null,
            files: [],
            exhibits: [],
          },
          answers: [
            {
              id: 'd36e77d8-c768-4552-b052-2d8fbf42a5e1',
              answer: 'sai 1',
              answer_position: 1,
            },
            {
              id: '1b66ed9f-eede-4b24-adf0-873ff8b3f683',
              answer: 'sai 1',
              answer_position: 1,
            },
            {
              id: '1b9549f5-6b7f-405f-8f99-7dbd1758b000',
              answer:
                'đúng 1ww wwww wwwww wwwww wwwww wwww wwwww www wwww wwwww',
              answer_position: 1,
            },
            {
              id: '37765751-4b81-4d67-920e-523413dd41ab',
              answer: 'sai 2',
              answer_position: 2,
            },
            {
              id: '6044f25d-553e-4e4f-8d66-83d88b6b7f97',
              answer: 'đúng 2',
              answer_position: 2,
            },
            {
              id: '3d4a23c2-aed5-4d86-a200-47af8c6426b9',
              answer: 'sai 2',
              answer_position: 2,
            },
            {
              id: 'f4b8029b-bede-48f3-ae61-a1337abf37db',
              answer: 'sai',
              answer_position: 3,
            },
            {
              id: '929675fd-c8d1-4266-b1d6-fb7544483e8a',
              answer: 'đúng',
              answer_position: 3,
            },
            {
              id: 'd319df1e-0dd9-4c69-81a9-601fee3f58c3',
              answer: 'sai',
              answer_position: 4,
            },
            {
              id: 'd20f5b1a-c4ad-4c76-8a35-59fad73fd35a',
              answer: 'đúng',
              answer_position: 4,
            },
            {
              id: 'e8b90840-db42-4089-9c7b-be39192fba34',
              answer: 'sai',
              answer_position: 5,
            },
            {
              id: '87620036-89ee-40e5-9435-ed1e497a3b2a',
              answer: 'đúng',
              answer_position: 5,
            },
            {
              id: '7168ff06-e6f4-4ee4-951a-a8a57eeff695',
              answer: 'sai',
              answer_position: 6,
            },
            {
              id: '1c1b5c3f-da10-44c6-8605-0c958ff05b47',
              answer: 'đúng',
              answer_position: 6,
            },
            {
              id: '420f44a4-5d67-494e-8c3e-55c03c9f3abf',
              answer: 'đúng',
              answer_position: 7,
            },
            {
              id: '817b6369-af41-46a5-8f1c-24da61ed501d',
              answer: 'sai',
              answer_position: 7,
            },
            {
              id: '9b78a8f5-3138-4988-9ea7-e377fe8a51c6',
              answer: 'đúng',
              answer_position: 8,
            },
            {
              id: 'a6258f98-09d3-49e2-84d5-e7430a6ea749',
              answer: 'sai',
              answer_position: 8,
            },
            {
              id: 'bd36c1e6-c4f7-4183-8cb8-24873c77d1fa',
              answer: 'đúng',
              answer_position: 9,
            },
            {
              id: 'feedc7bd-edc9-49c6-ab85-0a980d0d3cb9',
              answer: 'sai',
              answer_position: 9,
            },
            {
              id: '99aad409-60b7-412d-8a72-a6bce13242e7',
              answer: 'đúng',
              answer_position: 10,
            },
            {
              id: 'fdbfc941-f528-4fa3-9e19-a16fdb9fe133',
              answer: 'sai',
              answer_position: 10,
            },
            {
              id: '96cb472f-9c93-47a3-8686-1c4c272fe82c',
              answer: 'đúng',
              answer_position: 11,
            },
            {
              id: '2ff2e546-33db-4223-b62b-db112f91495f',
              answer: 'sai',
              answer_position: 11,
            },
          ],
          question_matchings: [],
          files: [],
          exhibits: [],
          requirements: [],
        } as unknown as IQuestion,
        reveal: 'continue',
      },
    ],
  },
  {
    id: 'task-8',
    title: 'Task',
    blocks: [
      {
        id: 'task-8-block-2',
        type: 'text',
        text: 'Fill word',
        reveal: 'auto',
      },
      {
        id: 'task-8-block-3',
        type: 'quiz',
        question: {
          id: '5b3699db-62a8-4e9f-a87c-b23a501001fc',
          key: 'QN000773',
          question_content:
            '<p>Fill up</p>\n<ul>\n<li>text abc&nbsp;<span id="20dbb656-0608-441d-a66f-22b8baeb13a1" class="question-content-tag" contenteditable="false">[_______]</span><!--StartFragment--><!-- x-tinymce/html --></li>\n<li><strong style="font-weight: bold;">text abc <span id="84d56d87-102a-4563-9d1e-8ff53d7bef7a" class="question-content-tag" contenteditable="false">[_______]</span></strong></li>\n</ul>\n<ol>\n<li><span style="text-decoration: underline;">text abc</span></li>\n<li><em style="font-style: italic;">text abc</em> <!--StartFragment--><!-- x-tinymce/html --></li>\n</ol>\n<p style="line-height: 2; padding-left: 160px;"><s>text abc</s><!--StartFragment--><!-- x-tinymce/html --></p>\n<p>căn tr&aacute;i</p>\n<p style="text-align: right;">căn phải</p>\n<p style="text-align: center;">căn giữa</p>\n<p><span style="font-size: 20px;">chữ to</span></p>\n<p><span style="font-size: 10px;">chữ nhỏ</span></p>\n<p><span style="font-family: \'book antiqua\', palatino;">kiểu chữ kh&aacute;c</span></p>\n<p><a title="title của hyperlink (tooltip)" href="https://www.google.com/" target="_blank" rel="noopener">đ&acirc;y l&agrave; hyperlink</a></p>\n<ul>\n<li style="text-align: right;">a</li>\n<li style="text-align: right;">b</li>\n</ul>\n<ol>\n<li style="text-align: center;">c</li>\n<li style="text-align: center;">d</li>\n</ol>\n<p>😃</p>\n<p>$</p>\n<table style="border-color: rgb(209, 213, 219); border-radius: 8px; border-collapse: separate; border-spacing: 0px; overflow: hidden; height: 160px; width: 86.4492%; margin-left: auto; margin-right: auto;" border="1"><colgroup><col style="width: 9.75255%;"><col style="width: 42.256%;"><col style="width: 47.8459%;"></colgroup>\n<tbody>\n<tr>\n<td>STT</td>\n<td style="text-align: center;">T&ecirc;n</td>\n<td style="text-align: right;">Tuổi</td>\n</tr>\n<tr>\n<td>1</td>\n<td style="text-align: center; line-height: 1;">Nguyễn Văn A<span id="1931df07-d89f-48b6-b95d-34e1790c4e9c" class="question-content-tag" contenteditable="false">[_______]</span></td>\n<td style="text-align: right;">\n<p><span id="fc928357-8254-42cc-a328-f253961f432a" class="question-content-tag" contenteditable="false">[_______]</span>10</p>\n<p style="text-align: center;"><span id="2cfb77d8-db81-4c1c-ac89-75ea7d8da886" class="question-content-tag" contenteditable="false">[_______]</span>20</p>\n<p style="text-align: left;"><span id="6150fff8-b737-431b-89d2-4fd77f0063b8" class="question-content-tag" contenteditable="false">[_______]</span>30</p>\n<p style="text-align: left;">&nbsp;</p>\n<p style="text-align: left;">40 <span id="f7e2b7e9-0d4f-40ad-9860-59e116683dc8" class="question-content-tag" contenteditable="false">[_______]</span></p>\n<p style="text-align: center;">50<span id="f891b2f1-bb69-4d5e-8417-2b7bc53ab631" class="question-content-tag" contenteditable="false">[_______]</span></p>\n<p style="text-align: right;">60<span id="fa632607-316e-4d2b-9745-3577cca461e8" class="question-content-tag" contenteditable="false">[_______]</span></p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><img id="8e664f9d-6299-4c49-8b16-73ccd7553472" resource_id="000235bf-ba61-423e-850b-5ae0b75fcb57" title="b54fc0fc3bd8a5775a08061ee30843a1.jpg" src="https://cdn-staging.sapp.edu.vn/temp/1764824512325_b54fc0fc3bd8a5775a08061ee30843a1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20260206%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20260206T083727Z&X-Amz-Expires=3600&X-Amz-Signature=390d0cf099e8e3369a222dfa616f05b12a62377a7c6fc288b6a0f14638df8b12&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" width="200" style="display: block; margin-left: auto; margin-right: auto;"></p>\n<p><img id="3278091d-9fac-4554-a814-44a382a02eb9" resource_id="a396139d-7013-4186-a6a1-b3b30589ac78" title="b54fc0fc3bd8a5775a08061ee30843a1.jpg" src="https://cdn-staging.sapp.edu.vn/course/60afd88b-2503-4851-aabe-c6cbd663dd44/1764838419939_b54fc0fc3bd8a5775a08061ee30843a1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20260206%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20260206T083727Z&X-Amz-Expires=3600&X-Amz-Signature=a4f280b3afa2f01ed2d31675ada7a5cca07e995909c210a449be9fbebd1903ab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" width="851" height="851" style="float: right;"></p>\n<p><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math></p>\n<p><!--StartFragment--><!-- x-tinymce/html --><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math><!--EndFragment--></p>\n<p style="text-align: right;"><!--StartFragment--><!-- x-tinymce/html --><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math><span id="231fe5f3-aa5d-499c-9181-1fbf98058065" class="question-content-tag" contenteditable="false">[_______]</span><!--EndFragment--></p>\n<p><math xmlns="http://www.w3.org/1998/Math/MathML" class="wrs_chemistry"><mmultiscripts><mi mathvariant="normal">z</mi><mprescripts></mprescripts><mi mathvariant="normal">y</mi><mi mathvariant="normal">x</mi></mmultiscripts><mo>+</mo><msubsup><mi mathvariant="normal">x</mi><mi mathvariant="normal">z</mi><mi mathvariant="normal">y</mi></msubsup><mspace linebreak="newline"></mspace><mfenced open="[" close="]"><mtable><mtr><mtd><mi mathvariant="normal">x</mi></mtd><mtd><mi mathvariant="normal">y</mi></mtd></mtr><mtr><mtd><mi mathvariant="normal">z</mi></mtd><mtd><mi mathvariant="normal">m</mi></mtd></mtr></mtable></mfenced></math></p>',
          level: 'FUNDAMENTAL',
          qType: 'FILL_WORD',
          assignment_type: null,
          response_option: null,
          display_type: 'HORIZONTAL',
          status: 'BLOCK',
          is_self_reflection: false,
          answer_template: null,
          answer_template_files: [],
          question_topic: {
            id: '4817e4d6-e0b8-4e9f-a3da-92a6270d31e8',
            description: null,
            files: [],
            exhibits: [],
          },
          answers: [
            {
              id: '8b69acae-70d4-4cdb-8bc5-24a7cc22bce7',
              answer: 'đúng 1',
              answer_position: 1,
            },
            {
              id: '4e1c17ab-a786-41ac-974b-6a1e6db35ff7',
              answer: 'đúng 2',
              answer_position: 2,
            },
            {
              id: '7085ee76-8c8e-4cc6-a22d-fca865b25587',
              answer: 'đúng 3',
              answer_position: 3,
            },
            {
              id: '90be0fe6-9926-4fde-b607-0daa9bf1cdca',
              answer: 'đúng 4',
              answer_position: 4,
            },
            {
              id: '613667db-3fb9-4fb0-90f6-1870b43e84d5',
              answer: 'đúng',
              answer_position: 5,
            },
            {
              id: 'aca0ecbd-ae90-4cb6-a5d2-96a2f4d44acb',
              answer: 'đúng',
              answer_position: 6,
            },
            {
              id: 'c17c0176-a83d-4877-bca2-048d7f26667e',
              answer: 'đúng',
              answer_position: 7,
            },
            {
              id: '5e27ab42-e241-4bad-a5f9-8e92690bd16c',
              answer: 'đúng',
              answer_position: 8,
            },
            {
              id: '121db0c3-9ef2-44fa-ba0f-84dbf0abd948',
              answer: 'đúng',
              answer_position: 9,
            },
            {
              id: 'd21c310f-2767-444c-807a-143e73f9d933',
              answer: 'đúng 5',
              answer_position: 10,
            },
          ],
          question_matchings: [],
          files: [],
          exhibits: [],
          requirements: [],
        } as unknown as IQuestion,
        reveal: 'continue',
      },
    ],
  },
  {
    id: 'task-9',
    title: 'Task',
    blocks: [
      {
        id: 'task-9-block-2',
        type: 'text',
        text: 'Drag drop',
        reveal: 'auto',
      },
      {
        id: 'task-9-block-3',
        type: 'quiz',
        question: {
          id: '60236027-a2fc-4aba-8837-a7c3c2f9cee1',
          key: 'QN000774',
          question_content:
            '<p>Drag drop</p>\n<ul>\n<li>text abc&nbsp;<span id="20dbb656-0608-441d-a66f-22b8baeb13a1" class="question-content-tag" contenteditable="false">[_______]</span><!--StartFragment--><!-- x-tinymce/html --></li>\n<li><strong style="font-weight: bold;">text abc <span id="84d56d87-102a-4563-9d1e-8ff53d7bef7a" class="question-content-tag" contenteditable="false">[_______]</span></strong></li>\n</ul>\n<ol>\n<li><span style="text-decoration: underline;">text abcdefghijklmnopqrstuv</span></li>\n<li><em style="font-style: italic;">text abc</em> <!--StartFragment--><!-- x-tinymce/html --></li>\n</ol>\n<p style="line-height: 2; padding-left: 160px;"><s>text abc</s><!--StartFragment--><!-- x-tinymce/html --></p>\n<p>căn tr&aacute;i</p>\n<p style="text-align: right;">căn phải</p>\n<p style="text-align: center;">căn giữa</p>\n<p style="text-align: left;">text: <span id="8d8f1836-ee49-45a5-acfc-5fa697e1838c" class="question-content-tag" contenteditable="false">[_______]</span>____</p>\n<p style="text-align: center;"><img id="116cc714-5b28-4c1c-91e2-0ce9d9d8a6e6" resource_id="8c06b971-d25a-4cd7-a25d-850d3f28f538" title="as.jpg" src="https://cdn-staging.sapp.edu.vn/item_set/974cb8a5-f11a-4a7c-b806-4a4225463465/question/60236027-a2fc-4aba-8837-a7c3c2f9cee1/1765176925070_as.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20260206%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20260206T084011Z&X-Amz-Expires=3600&X-Amz-Signature=11d4baae52d163d795c50c5f10e4e02b54001bf7ecb57d18c655b017a101b17a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" width="200"></p>\n<p><span style="font-size: 20px;">chữ to</span></p>\n<p><span style="font-size: 10px;">chữ nhỏ</span></p>\n<p><span style="font-family: \'book antiqua\', palatino;">kiểu chữ kh&aacute;c</span></p>\n<p><a title="title của hyperlink (tooltip)" href="https://www.google.com/" target="_blank" rel="noopener">đ&acirc;y l&agrave; hyperlink</a></p>\n<ul>\n<li style="text-align: right;">a</li>\n<li style="text-align: right;">b</li>\n</ul>\n<ol>\n<li style="text-align: center;">c</li>\n<li style="text-align: center;">d</li>\n</ol>\n<p>😃</p>\n<p>$</p>\n<table style="border-color: rgb(209, 213, 219); border-radius: 8px; border-collapse: separate; border-spacing: 0px; overflow: hidden; height: 160px; width: 60.5159%; margin-left: auto; margin-right: auto;" border="1"><colgroup><col style="width: 8.77743%;"><col style="width: 57.9937%;"><col style="width: 33.2288%;"></colgroup>\n<tbody>\n<tr>\n<td>STT</td>\n<td style="text-align: center;">T&ecirc;n</td>\n<td style="text-align: right;">Tuổi</td>\n</tr>\n<tr>\n<td>1</td>\n<td style="text-align: center; line-height: 1;">Nguyễn Văn A<span id="ef464e1f-d2a2-412d-b9e8-b5a2d7fbf3c1" class="question-content-tag" contenteditable="false">[_______]</span></td>\n<td style="text-align: right;"><span id="14fefe6c-daa7-4368-ada4-194f0d82d00f" class="question-content-tag" contenteditable="false">[_______]</span>10</td>\n</tr>\n</tbody>\n</table>\n<p style="text-align: left;">text căn tr&aacute;i</p>\n<p><img id="8e664f9d-6299-4c49-8b16-73ccd7553472" resource_id="000235bf-ba61-423e-850b-5ae0b75fcb57" title="b54fc0fc3bd8a5775a08061ee30843a1.jpg" src="https://cdn-staging.sapp.edu.vn/temp/1764824512325_b54fc0fc3bd8a5775a08061ee30843a1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20260206%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20260206T084011Z&X-Amz-Expires=3600&X-Amz-Signature=64b1f871d3415f8eb0e7940196ee65f9cf8a7fd606a55db7d0c522a9ca255349&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" width="200" style="display: block; margin-left: auto; margin-right: auto;"></p>\n<p><img id="3278091d-9fac-4554-a814-44a382a02eb9" resource_id="a396139d-7013-4186-a6a1-b3b30589ac78" title="b54fc0fc3bd8a5775a08061ee30843a1.jpg" src="https://cdn-staging.sapp.edu.vn/course/60afd88b-2503-4851-aabe-c6cbd663dd44/1764838419939_b54fc0fc3bd8a5775a08061ee30843a1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20260206%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20260206T084011Z&X-Amz-Expires=3600&X-Amz-Signature=1419e93b968954f1dcefac4442cab5edf451e4755a1ef7e2cbe4198ded96885b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" width="851" height="851" style="float: right;"></p>\n<p><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math></p>\n<p><!--StartFragment--><!-- x-tinymce/html --><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math><!--EndFragment--></p>\n<p style="text-align: right;"><!--StartFragment--><!-- x-tinymce/html --><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mrow><mn>1</mn><msup><mi>x</mi><mn>2</mn></msup></mrow><msup><mn>2</mn><mi>x</mi></msup></mfrac><mo>+</mo><mroot><mfrac bevelled="true"><mi>y</mi><mn>4</mn></mfrac><mn>3</mn></mroot><mo>&#8805;</mo><msup><mfenced><mfenced open="|" close="|"><msub><mi>Z</mi><mn>3</mn></msub></mfenced></mfenced><mi>m</mi></msup></math><span id="0c16829e-951d-46e7-a14a-01d9bbdec0b6" class="question-content-tag" contenteditable="false">[_______]</span><!--EndFragment--></p>\n<p><math xmlns="http://www.w3.org/1998/Math/MathML" class="wrs_chemistry"><mmultiscripts><mi mathvariant="normal">z</mi><mprescripts></mprescripts><mi mathvariant="normal">y</mi><mi mathvariant="normal">x</mi></mmultiscripts><mo>+</mo><msubsup><mi mathvariant="normal">x</mi><mi mathvariant="normal">z</mi><mi mathvariant="normal">y</mi></msubsup><mspace linebreak="newline"></mspace><mfenced open="[" close="]"><mtable><mtr><mtd><mi mathvariant="normal">x</mi></mtd><mtd><mi mathvariant="normal">y</mi></mtd></mtr><mtr><mtd><mi mathvariant="normal">z</mi></mtd><mtd><mi mathvariant="normal">m</mi></mtd></mtr></mtable></mfenced></math></p>',
          level: 'FUNDAMENTAL',
          qType: 'DRAG_DROP',
          assignment_type: null,
          response_option: null,
          display_type: 'HORIZONTAL',
          status: 'BLOCK',
          is_self_reflection: false,
          answer_template: null,
          answer_template_files: [],
          question_topic: {
            id: '974cb8a5-f11a-4a7c-b806-4a4225463465',
            description: null,
            files: [],
            exhibits: [],
          },
          answers: [
            {
              id: 'dd9d27cd-7b16-4925-97a9-e02348aa98bb',
              answer: 'đúng 2',
              answer_position: 1,
            },
            {
              id: 'a655dd35-3af1-4bee-ad41-1fa075bb08a1',
              answer: 'đúng 4',
              answer_position: 2,
            },
            {
              id: '55f412fd-065d-4fd1-b588-00d73e56b634',
              answer:
                'Các hạng mục sân bay Long Thành như đường băng, nhà ga, tháp không lưu, trạm radar, bồn chứa nhiên liệu, trụ sở các cơ quan dần hoàn thiện.',
              answer_position: 3,
            },
            {
              id: '8eff9a1c-dc52-4989-bf33-3e6d51dfc1ee',
              answer: 'đúng 5',
              answer_position: 4,
            },
            {
              id: '232d3a27-e9f8-4906-8598-b094502b3cdf',
              answer: 'đúng 3',
              answer_position: 5,
            },
            {
              id: '41f11c36-059e-4dfe-8f10-a2e5b3f0317a',
              answer: 'nhiễu',
              answer_position: 6,
            },
            {
              id: 'e88a99ee-a5b8-49fd-8e3c-047101144426',
              answer:
                'đúng 1 www wwwww wwww wwwwww wwwww wwww www wwwww wwww wwwwww wwwww www ww',
              answer_position: 7,
            },
          ],
          question_matchings: [],
          files: [],
          exhibits: [],
          requirements: [],
        } as unknown as IQuestion,
        reveal: 'continue',
      },
    ],
  },
  {
    id: 'task-1',
    title: 'Task',
    blocks: [
      {
        id: 'task-1-block-1',
        type: 'image',
        src: '/assets/images/image_404.jpg',
        reveal: 'auto',
      },
      {
        id: 'task-1-block-2',
        type: 'text',
        text: `<div>
          <h2 class="text-xl font-semibold mb-4">Where can I get some?</h2>
            <p>Telline is a call center...</p>
            <p class="mb-4">The other 30 employees...</p>
            <image src="/thumbnail.png" alt="Office" />
            <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</p>
          </div>`,
        reveal: 'continue',
      },
      {
        id: 'task-1-block-3',
        type: 'text',
        text: 'The other 30 employees...',
        reveal: 'continue',
      },
    ],
  },
  {
    id: 'summary',
    title: 'Summary',
    blocks: [
      {
        id: 'summary-block-1',
        type: 'text',
        text: `<div class="flex justify-center items-centertext-lg">
            <image src="/icon.png" alt="Office" />
            <div>Story Complete!</div>
            </div>`,
        reveal: 'auto',
      },
    ],
  },
]
