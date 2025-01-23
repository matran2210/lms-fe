import { Editor } from '@tinymce/tinymce-react'
import { useEffect, useRef, useState } from 'react'
import tinymce from 'tinymce/tinymce'
import { Spin } from 'antd'
import { VALID_UPLOAD_EDITOR } from 'src/constants'
// import {
//   VALID_UPLOAD_EDITOR,
//   VALID_UPLOAD_EDITOR_IMAGE,
//   VALID_UPLOAD_EDITOR_VIDEO,
// } from 'src/constants/upload'
// import {validateFile} from 'src/utils/upload'
// import {v4 as uuid} from 'uuid'
// import ModalPlayVideo from './modalVideo'
// // import ModalUploadVideo from 'src/components/base/upload-file/ModalUploadVIdeo/ModalUploadVideo'
// import {ResourcesAPI} from 'src/apis/resources'
// import ModalUploadFile from 'src/components/base/upload-file/ModalUploadFile/ModalUploadFile'
// import {RESOURCE_STATUS} from 'src/type/resource'
// import {RESOURCE_LOCATION} from 'src/components/base/upload-file/ModalUploadFile/UploadFileInterface'
// import ModalPreviewImage from 'src/components/base/ModalPreviewImage'
// const jsDemoImagesTransform = document.createElement("script");
// jsDemoImagesTransform.type = "text/javascript";
// jsDemoImagesTransform.src =
//   "https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image";
// document.head.appendChild(jsDemoImagesTransform);
// declare const window: any
// window.$ = $
// window.tinymce = require('tinymce')
// require('@wiris/mathtype-tinymce6')

interface IProps {
  onChange: (...event: any[]) => void
  valueText?: string
  className?: string
  height?: number
  math?: boolean
  placeholder?: string
  getContent?: (e: string) => void
  acceptFiles?: { type: string; size: number }[]
  disabled?: boolean
  key?: number | string
}

const TinyEditor = ({
  onChange,
  valueText,
  className,
  height,
  math,
  placeholder,
  getContent,
  acceptFiles = VALID_UPLOAD_EDITOR,
  disabled,
  key,
}: IProps) => {
  const editorRef = useRef(null) as any
  const [initialValue, setInitialValue] = useState<any>('')
  const [loaded, setLoaded] = useState(false)
  //   const [open, setOpen] = useState<{
  //     status: boolean
  //     type: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | ''
  //   }>({status: false, type: ''})
  //   const [openVideo, setOpenVideo] = useState<{
  //     status: boolean
  //     src?: string
  //     resourceStatus?: RESOURCE_STATUS
  //   }>({
  //     status: false,
  //   })
  // const [openPreviewImage, setOpenPreviewImage] = useState<boolean>(false)
  // const [previewImage, setPreviewImage] = useState<string>()
  //   const acceptVideo = VALID_UPLOAD_EDITOR_VIDEO
  //   const acceptImage = VALID_UPLOAD_EDITOR_IMAGE
  //   const handleSelectFile = async (e: any) => {
  //     const res = await ResourcesAPI.getUrl(e.id || e?.[0]?.id)
  //     if (open.type === 'IMAGE') {
  //       editorRef?.current?.insertContent(
  //         `<img id="${uuid()}" resource_id="${res.data.id}" title="${res.data.name}" src="${
  //           res.data.url
  //         }" width="200">`
  //       )
  //     } else {
  //       editorRef?.current?.insertContent(
  //         `<video
  //       preload='auto'
  //       id="${uuid()}" resource_id="${res.data.id}"
  //       poster='${res.data.thumbnail}'
  //       >
  //         <source src=${res.data.url} id="${uuid()}" resource_id="${res.data.id}" resource_status='${
  //           res?.data?.status
  //         }'/>
  //       </video>`
  //       )
  //     }
  //     setOpen({status: false, type: ''})
  //   }
  useEffect(() => setInitialValue(valueText), [])
  const [loading, setLoading] = useState(false)
  const handleFilePicker = (cb: any) => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')

    const acceptedTypes = acceptFiles.map((file) => file.type)

    input.setAttribute('accept', acceptedTypes.join(', '))
    input.onchange = async function () {
      // showLoadingUpload(true)

      const files = input?.files as any

      for (let file of files) {
        // if (!validateFile(file, acceptFiles)) continue

        const blob = URL.createObjectURL(file)
        cb(blob, { title: file.name })
      }

      // showLoadingUpload(false)
    }
    input.click()
  }
  // const handleFilePickerVideo = () => {
  //   const input = document.createElement('input')
  //   input.setAttribute('type', 'file')

  //   const acceptedTypes = acceptVideo.map((file) => file.type)

  //   input.setAttribute('accept', acceptedTypes.join(', '))
  //   input.onchange = async function () {
  //     // showLoadingUpload(true)
  //     setLoading(true)
  //     const files = input?.files as any

  //     for (let file of files) {
  //       if (!validateFile(file, acceptFiles)) continue

  //       const blob = URL.createObjectURL(file)
  //       const thumbnails = await getThumbnails(blob, {quality: 0.2, start: 1, end: 3})
  //       const thumbnailBlob = URL.createObjectURL(thumbnails[0].blob as Blob)

  //       editorRef?.current?.insertContent(`<video
  //       preload='auto'
  //       poster='${thumbnailBlob}'
  //       >
  //         <source src=${blob} />
  //       </video>`)
  //     }

  //     setLoading(false)
  //   }
  //   input.click()
  // }
  // const handleFilePickerImage = () => {
  //   const input = document.createElement('input')
  //   input.setAttribute('type', 'file')

  //   const acceptedTypes = acceptImage.map((file) => file.type)

  //   input.setAttribute('accept', acceptedTypes.join(', '))
  //   input.onchange = async function () {
  //     setLoading(true)

  //     const files = input?.files as any

  //     for (let file of files) {
  //       if (!validateFile(file, acceptFiles)) continue
  //       const fileName = file.name
  //       const blob = URL.createObjectURL(file)
  //       editorRef?.current?.insertContent(`
  //       <img title="${fileName}" src="${blob}" width="200">
  //       `)
  //     }

  //     setLoading(false)
  //   }
  //   input.click()
  // }

  // const log = () => {
  //   if (editorRef.current) {
  //     console.log(editorRef.current.getContent())
  //   }
  // }
  useEffect(() => {
    if (loaded && getContent) {
      const rawContent = editorRef?.current?.getContent({ format: 'text' })
      getContent(rawContent)
    }
  }, [loaded, editorRef])
  //   const handleOpenModal = (status: boolean) => {
  //     setOpen({status: status, type: ''})
  //   }
  return (
    <div className={className ?? ''}>
      {/* <ModalUploadFile
        open={open.status}
        setOpen={(e: any) => handleOpenModal(e)}
        setSelectedFile={handleSelectFile}
        fileType={open.type || 'IMAGE'}
        resourceLocation={RESOURCE_LOCATION.topic}
      /> */}
      <Spin spinning={loading}>
        <Editor
          {...(key && { key: key })}
          disabled={disabled}
          apiKey={process.env.NEXT_PUBLIC_TINY_EDITDER_API_KEY}
          initialValue={valueText}
          onInit={(evt, editor) => {
            editorRef.current = editor
          }}
          init={{
            placeholder: placeholder,
            font_size_formats:
              '8px 10px 12px 14px 16px 18px 20px 22px 24px 36px',
            height: height || 500,
            selector: 'textarea' as any,
            font_family_formats:
              'Roboto=Roboto; Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
            image_advtab: true,
            image_uploadtab: true,
            paste_data_images: true,
            tinydrive_token_provider:
              'mtkwk0w43jdjib0f70dzupugcwokur6hr4htpa4c6q0kn6cp',
            plugins: [
              // 'mediaembed',
              // 'tinydrive',
              'lists',
              'advlist',
              'table',
              'code',
              'help',
              'wordcount',
              'fullscreen',
              'insertdatetime',
              'charmap',
              'preview',
              'anchor',
              'searchreplace',
              'visualblocks',
              'media',
              'image',
            ],
            mediaembed_max_width: 450,
            // menubar: "insert",
            menu: {
              insert: {
                title: 'Insert',
                items:
                  'table charmap hr pagebreak nonbreaking anchor toc insertdatetime',
              },
            },
            toolbar:
              'uploadVideo | uploadImage | openGroup | undo redo | blocks | fontfamily fontsize | bold italic underline strikethrough|link| table| mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat | tiny_mce_wiris_formulaEditor | tiny_mce_wiris_formulaEditorChemistry | code',
            tinycomments_mode: 'embedded',
            htmlAllowedTags: ['.*'],
            htmlAllowedAttrs: ['.*'],
            toolbar_mode: 'sliding',
            // extended_valid_elements: '*[.*]',

            content_style: `
          @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro&display=swap');
          body 
          { 
            font-family: Roboto,sans-serif;
            color:#5E6278;
            font-size: 14px;
            font-weight: 500;
            line-height: 1.5;
            appearance: none;
          }
          .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
            color:#A1A5B7;
            font-weight: 500 ;
            opacity: 1;
            display: block;
            font-family: Roboto,sans-serif;
            font-size: 14px;
          }
          .mce-content-body [contentEditable=false][data-mce-selected] {
            cursor: default
          }
          `,
            setup: function (editor) {
              // var scriptLoader = new tinymce.dom.ScriptLoader()
              // scriptLoader.add('https://unpkg.com/video.js/dist/video-js.min.css')
              // scriptLoader.loadQueue()
              editor.ui.registry.addIcon(
                'block',
                '<svg width="20" height="20" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M144.667 448H59.3333C46.5333 448 38 439.467 38 426.667V85.3333C38 72.5333 46.5333 64 59.3333 64H144.667C157.467 64 166 72.5333 166 85.3333C166 98.1333 157.467 106.667 144.667 106.667H80.6667V405.333H144.667C157.467 405.333 166 413.867 166 426.667C166 439.467 157.467 448 144.667 448Z" fill="black"/><path d="M367.333 64H452.667C465.467 64 474 72.5333 474 85.3333V426.667C474 439.467 465.467 448 452.667 448H367.333C354.533 448 346 439.467 346 426.667C346 413.867 354.533 405.333 367.333 405.333H431.333V106.667H367.333C354.533 106.667 346 98.1333 346 85.3333C346 72.5333 354.533 64 367.333 64Z" fill="black"/><path d="M341.334 362C328.734 362 320.334 353.6 320.334 341C320.334 328.4 328.734 320 341.334 320C353.934 320 362.334 328.4 362.334 341C362.334 353.6 353.934 362 341.334 362Z" fill="black"/><path d="M256 362C243.4 362 235 353.6 235 341C235 328.4 243.4 320 256 320C268.6 320 277 328.4 277 341C277 353.6 268.6 362 256 362Z" fill="black"/><path d="M170.666 362C158.066 362 149.666 353.6 149.666 341C149.666 328.4 158.066 320 170.666 320C183.266 320 191.666 328.4 191.666 341C191.666 353.6 183.266 362 170.666 362Z" fill="black"/></svg>',
              )
              //   editor.ui.registry.addButton('storage', {
              //     icon: 'browse',
              //     // text: 'Storage',
              //     onAction: function (e: any) {
              //       setOpen({status: true, type: 'IMAGE'})
              //     },
              //   })
              //   editor.ui.registry.addButton('uploadVideo', {
              //     icon: 'embed',
              //     // text: 'Storage',
              //     onAction: function (e: any) {
              //       setOpen({status: true, type: 'VIDEO'})
              //     },
              //   })
              //   editor.ui.registry.addButton('uploadImage', {
              //     icon: 'image',
              //     // text: 'Storage',
              //     onAction: function (e: any) {
              //       setOpen({status: true, type: 'IMAGE'})
              //     },
              //   })
              //   editor.ui.registry.addButton('openGroup', {
              //     // text: '[]',
              //     icon: 'block',
              //     onAction: function () {
              //       editor.insertContent(
              //         `<span id=${uuid()} class="question-content-tag" contenteditable="false">[_______]</span>`
              //       )
              //     },
              //   })
              //   editor.on('click', function (e) {
              //     const element = e.target
              //     if (element.getAttribute('data-mce-object') === 'video') {
              //       const content = element.querySelector('video source')?.getAttribute('src')
              //       // if (content) {
              //       const status = element?.querySelector('source')?.getAttribute('resource_status')
              //       setOpenVideo({status: true, src: content, resourceStatus: status})
              //       // }
              //       return
              //     }
              //     if (element.tagName === 'IMG') {
              //       setOpenPreviewImage(true)
              //       setPreviewImage(element?.src)
              //     }
              //   })
            },
            image_title: true,
            extended_valid_elements:
              'video[data-setup|src|width|height|class|poster|id|resource_id],img[*],source[*]',
            automatic_uploads: false,
            // images_file_types: 'jpeg png',
            images_file_types: 'png,jpg,gif',
            // file_picker_types: 'image media file',
            file_picker_callback: handleFilePicker,
          }}
          onEditorChange={(e) => {
            if (loaded) {
              onChange(e)
            }
          }}
          onLoadContent={(e: any) => {
            setLoaded(e.initial)
          }}
          // value={valueText}
        />
      </Spin>
      {/* <ModalPlayVideo
        open={openVideo.status}
        src={openVideo.src}
        resourceStatus={openVideo.resourceStatus}
        setOpen={setOpenVideo}
      />
      <ModalPreviewImage
        openPreview={openPreviewImage}
        setOpenPreview={setOpenPreviewImage}
        avatarResize={previewImage}
        title={'Preview Image'}
      /> */}
      {/* <button onClick={log}>Log editor content</button> */}
    </div>
  )
}

export default TinyEditor
