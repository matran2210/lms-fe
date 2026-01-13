import { TestServiceAPI } from '@pages/api/test-api'

export const download = async (name: string, file_key: string) => {
  await TestServiceAPI.downloadFile({
    files: [
      {
        name: name,
        file_key: file_key,
      },
    ],
  })
}
