import { fetcher } from '@services/requestV2'
import { IResponse } from 'src/redux/types'
import {
  IBusyRequestDetailResponse,
  IRecurringSchedule,
  IWeeklyNorm,
} from 'src/type/my-request'

export class MyRequestAPI {
  static createBusySchedule({
    event_name,
    repeat,
    range,
    recurring_schedule,
    description,
  }: {
    event_name: string
    repeat: boolean
    range: { start_time: string | Date; end_time: string | Date }
    recurring_schedule?: IRecurringSchedule | undefined
    description: string
  }): Promise<any> {
    return fetcher('/schedules/busy-schedule', {
      method: 'POST',
      data: {
        event_name: event_name,
        repeat: repeat,
        range: range,
        recurring_schedule: recurring_schedule,
        description: description,
      },
    })
  }
  static editBusySchedule(
    id: string,
    {
      event_name,
      repeat,
      range,
      recurring_schedule,
      description,
      status,
    }: {
      event_name?: string
      repeat?: boolean
      range?: { start_time: string | Date; end_time: string | Date }
      recurring_schedule?: IRecurringSchedule | undefined
      description?: string
      status: string | undefined
    },
  ): Promise<any> {
    return fetcher(`/request-schedules/busy-schedules/${id}`, {
      method: 'PUT',
      data: {
        event_name: event_name,
        repeat: repeat,
        range: range,
        recurring_schedule: recurring_schedule,
        description: description,
        status: status,
      },
    })
  }
  static createWeeklyNorms({
    request_name,
    request_type,
    time,
    note,
  }: {
    request_name: string
    request_type: string
    time?: IWeeklyNorm[]
    note?: string | null
  }): Promise<any> {
    return fetcher('/request-schedules/weekly-norm', {
      method: 'POST',
      data: {
        request_name: request_name,
        request_type: request_type,
        time: time,
        note: note,
      },
    })
  }
  static editWeeklyNorm(
    id: string,
    {
      request_name,
      request_type,
      status,
      time,
      note,
    }: {
      request_name?: string
      request_type?: string
      status: string | undefined
      time?: IWeeklyNorm[]
      note?: string | null
    },
  ): Promise<any> {
    return fetcher(`/request-schedules/weekly-norm/${id}`, {
      method: 'PUT',
      data: {
        request_name: request_name,
        request_type: request_type,
        status: status,
        time: time,
        note: note,
      },
    })
  }
  static createTimeoffRequest({
    request_name,
    teacher_id,
    scheduleAdjustments,
  }: {
    request_name: string
    teacher_id: string
    scheduleAdjustments?: { id: string; reason: string }[]
  }): Promise<any> {
    return fetcher('/request-schedules/time-off', {
      method: 'POST',
      data: {
        request_name: request_name,
        teacher_id: teacher_id,
        scheduleAdjustments: scheduleAdjustments,
      },
    })
  }
  static editTimeoffRequest(
    id: string,
    {
      request_name,
      status,
      scheduleAdjustments,
    }: {
      request_name?: string
      status?: string
      scheduleAdjustments?: { id: string; reason: string }[]
    },
  ): Promise<any> {
    return fetcher(`/request-schedules/time-off/${id}`, {
      method: 'PUT',
      data: {
        request_name: request_name,
        status: status,
        scheduleAdjustments: scheduleAdjustments,
      },
    })
  }
  static createChangeTeachingModeRequest({
    request_name,
    teacher_id,
    scheduleAdjustments,
  }: {
    request_name: string
    teacher_id: string
    scheduleAdjustments?: { id: string; reason: string }[]
  }): Promise<any> {
    return fetcher('/request-schedules/teaching-mode', {
      method: 'POST',
      data: {
        request_name: request_name,
        teacher_id: teacher_id,
        scheduleAdjustments: scheduleAdjustments,
      },
    })
  }
  static editTeachingModeRequest(
    id: string,
    {
      request_name,
      status,
      scheduleAdjustments,
    }: {
      request_name: string
      status?: string
      scheduleAdjustments?: { id: string; reason: string }[]
    },
  ): Promise<any> {
    return fetcher(`/request-schedules/teaching-mode/${id}`, {
      method: 'PUT',
      data: {
        request_name: request_name,
        status: status,
        scheduleAdjustments: scheduleAdjustments,
      },
    })
  }

  static getRequestDetail(
    id: string,
  ): Promise<IResponse<IBusyRequestDetailResponse>> {
    return fetcher(`/request-schedules/${id}`)
  }

  static getClass(
    page_index: number,
    page_size: number | undefined,
    teacher_id?: string,
  ) {
    return fetcher(`/classes/teachers`, {
      params: {
        page_index: page_index,
        page_size: page_size,
        ...(teacher_id ? { teacher_id } : {}),
      },
    })
  }

  static getLesson(
    page_index: number,
    page_size: number | undefined,
    teacher_id: string,
    class_id: string,
  ) {
    return fetcher(`/schedules/teacher-schedules/class`, {
      params: {
        page_index: page_index,
        page_size: page_size,
        ...(teacher_id ? { teacher_id } : {}),
        ...(class_id ? { class_id } : {}),
      },
    })
  }
}
