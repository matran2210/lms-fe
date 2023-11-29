import { getActToken } from '@utils/index'
import {fetcher} from 'src/services/request'

export const getCourse = (token: string) => {
  return fetcher(`courses?page_index=1&page_size=10`, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
}

