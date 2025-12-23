import { z } from 'zod'

export const zoomMeetingFormSchema = z.object({
  meetingNumber: z
    .string()
    .min(1, 'Meeting Number là bắt buộc')
    .regex(/^\d+$/, 'Meeting Number chỉ được chứa số')
    .min(9, 'Meeting Number phải có ít nhất 9 số')
    .max(11, 'Meeting Number không được quá 11 số'),

  passWord: z.string().min(1, 'Mật khẩu là bắt buộc').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),

  userName: z
    .string()
    .min(1, 'Tên người dùng là bắt buộc')
    .min(2, 'Tên người dùng phải có ít nhất 2 ký tự')
    .max(50, 'Tên người dùng không được quá 50 ký tự')
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, 'Tên người dùng chỉ được chứa chữ cái và khoảng trắng'),

  userEmail: z
    .string()
    .min(1, 'Email là bắt buộc')
    .email('Email không hợp lệ')
    .max(100, 'Email không được quá 100 ký tự'),
})

export type ZoomMeetingFormData = z.infer<typeof zoomMeetingFormSchema>
