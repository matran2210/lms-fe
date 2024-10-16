import axios, { AxiosResponse, CancelTokenSource } from 'axios'
import { IResponse } from 'src/redux/types'
import { apiURL, httpService } from 'src/redux/services/httpService'
import { fetcher, request } from '@services/requestV2'

type PartUploadDto = { part_number: number; upload_url: string }

type PartUploadedDto = { eTag: string; part_number: number }

type StartMultipartResponse = {
  uploadId: string
  parts: PartUploadDto[]
  metadata: {
    partSize: number
    numberOfParts: number
  }
}
export class UploadAPI {
  static async startUpload({
    content_type,
    name,
    size,
    blob,
    description,
    getProgress,
    location,
  }: {
    content_type: string
    name: string
    size: string
    blob: Blob
    description: string
    getProgress: (percent: number) => void
    location: string
  }) {
    try {
      const responsePreUpload = await preUpload({
        content_type,
        name: name || '',
        location: location || '',
        size,
      })

      await uploadFile(
        {
          upload_url: responsePreUpload.data.upload_url,
          file_key: responsePreUpload.data.file_key,
          type: responsePreUpload.data.type as 'SINGLE_PART' | 'MULTIPLE_PART',
          contentType: content_type,
          blob,
        },
        getProgress,
      )

      // const response = await addFileResource({
      //   name,
      //   file_key: responsePreUpload.data.file_key,
      //   location: location || '',
      //   description,
      //   size,
      //   parent_id: null,
      // })
      // return response?.data?.[0]?.id
      return responsePreUpload
      // if (response?.data?.[0]?.id) {
      //   const responseFile = await ResourcesAPI.getFileFromResource(response.data[0].id, source)
      //   return responseFile.data
      // }
    } catch (error) {
      throw error
    }
  }
  static downloadFile = async (data: {
    files: { name: string; file_key: string }[]
  }) => {
    try {
      const responseToken: IResponse<{
        data: string
        success: boolean
      }> = await httpService.POST({
        uri: 'resource/get-token-download',
        request: data,
      })
      if (responseToken?.success) {
        const link = document.createElement('a')
        link.href = `${apiURL}/resource/download?token=${responseToken?.data}`
        link.download = data.files[0].name
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {}
  }
}

const preUpload = async ({
  content_type,
  name,
  location,
  size,
}: {
  content_type: string
  name: string
  location: string | null
  size: string
}): Promise<
  IResponse<{
    type: string
    file_key: string
    upload_url: string
    name: string
  }>
> => {
  return fetcher(`${apiURL}/resource/pre-upload/metadata`, {
    params: {
      content_type,
      name,
      location,
      size,
    },
  })
}

const addFileResource = async ({
  name,
  file_key,
  location,
  description,
  size,
  parent_id,
}: {
  name: string
  file_key: string
  location: string
  description: string
  size: string
  parent_id: string | null
}) => {
  return await httpService.POST<any, any>({
    uri: `/resources/upload/add-file-resource`,
    data: {
      files: [
        {
          name,
          file_key,
          location,
          description,
          size,
          parent_id,
        },
      ],
    },
  })
}

let percent = 0

const uploadFile = async (
  file: {
    contentType: string
    file_key: string
    upload_url: string
    blob: Blob
    type: 'SINGLE_PART' | 'MULTIPLE_PART'
  },
  getProgress?: (percent: number) => void,
) => {
  const fileBlob = file.blob
  try {
    if (file.type === 'SINGLE_PART') {
      const onUploadProgress = (progressEvent: any) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        )
        if (getProgress) {
          getProgress(percent)
        }
      }
      try {
        await axios.put(file.upload_url, fileBlob, {
          headers: { 'Content-Type': fileBlob.type },
          onUploadProgress,
        })
      } catch (error) {
        throw error
      }
      return
    }

    const startResp = await request.post(`/resources/upload/start`, {
      file_key: file.file_key,
      content_type: fileBlob.type,
      size: fileBlob.size,
    })
    const startMultipartResponse: StartMultipartResponse = startResp.data.data
    const { uploadId, metadata, parts } = startMultipartResponse

    const batchSize = 2
    percent = 0
    const uploadPartsArray: PartUploadedDto[] = await uploadMultipart({
      batchSize,
      chunkSize: metadata.partSize,
      fileBlob,
      numberOfChunks: metadata.numberOfParts,
      parts,
      ...(getProgress ? { getProgress } : { getProgress: () => {} }),
    })

    await request.post(`/resources/upload/complete`, {
      file_key: file.file_key,
      parts: uploadPartsArray,
      uploadId: uploadId,
    })
  } catch (error) {
    throw error
  }
}

type UploadMultipartParams = {
  chunkSize: number
  numberOfChunks: number
  fileBlob: Blob
  index?: number
  batchSize: number
  parts: PartUploadDto[]
  getProgress: (percent: number) => void
}
async function uploadMultipart(
  params: UploadMultipartParams,
  source?: CancelTokenSource,
): Promise<PartUploadedDto[]> {
  const { chunkSize, numberOfChunks, fileBlob, batchSize, parts, getProgress } =
    params
  let index = params.index === undefined ? 0 : params.index

  const partNumbers = parts.map((part) => part.part_number)

  const batchUploadPromises: Promise<any>[] = []

  let batchElementIndex = 0

  while (batchElementIndex < batchSize && index < numberOfChunks) {
    index += 1
    batchElementIndex += 1

    const start = (index - 1) * chunkSize

    const end = index * chunkSize

    const blob =
      index < numberOfChunks
        ? fileBlob.slice(start, end)
        : fileBlob.slice(start)

    const uploadUrl = parts[partNumbers.indexOf(index)]?.upload_url
    try {
      const uploadPromise = getUploadPromise(
        {
          blob,
          contentType: fileBlob.type,
          index,
          uploadUrl,
          fileSize: fileBlob.size,
          chunkSize: blob.size,
          getProgress,
        },
        source,
      )
      batchUploadPromises.push(uploadPromise)
    } catch (error) {
      throw error
    }
  }

  const batchUploadResults = await Promise.allSettled(batchUploadPromises)
  const partsUploadResults: PartUploadedDto[] = []

  for (let result of batchUploadResults) {
    if (result.status === 'fulfilled') {
      let { response, index: part_number } = result.value
      partsUploadResults.push({
        eTag: response.headers.etag,
        part_number,
      })
    } else {
      throw new Error('One request failed: ' + result.reason)
    }
  }

  if (index < numberOfChunks) {
    const nextPartsUploadResults = await uploadMultipart({ ...params, index })
    return [...partsUploadResults, ...nextPartsUploadResults]
  }

  return partsUploadResults
}

type GetUploadPromiseParams = {
  blob: Blob
  uploadUrl?: string
  index: number
  contentType: string
  getProgress: (percent: number) => void
  fileSize: number
  chunkSize: number
}

function getUploadPromise(
  params: GetUploadPromiseParams,
  source?: CancelTokenSource,
): Promise<{ response: AxiosResponse<any, any>; index: number }> {
  const {
    blob,
    index,
    uploadUrl,
    contentType,
    getProgress,
    fileSize,
    chunkSize,
  } = params
  return new Promise((resolve, reject) => {
    if (!uploadUrl) {
      reject('Upload url is empty at part_number: ' + index)
    } else {
      axios
        .put(uploadUrl, blob, {
          headers: { 'Content-Type': contentType },
          ...(source && { cancelToken: source.token }),
        })
        .then((response) => {
          let percentCompleted = Math.round((chunkSize / fileSize) * 100)
          percent += percentCompleted
          getProgress(percent >= 100 ? 100 : percent)
          resolve({ response, index })
        })
        .catch((error) => {
          source &&
            source.cancel('One request failed, canceling all the others')
          getProgress(100)
          reject(error)
        })
    }
  })
}
