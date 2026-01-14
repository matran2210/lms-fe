import dayjs from 'dayjs'
import _, { round } from 'lodash'

/**
 * @description Return number percent with type: 80
 * @param {number} num
 * @param {number} total
 * @return {number} The percentage value of num relative to total. Returns 0 if total is 0.
 */
export const calculatePercentage = (num: number, total: number): number => {
  if (total === 0) {
    return 0
  }
  return round((num / total) * 100, 2)
}

type Option = {
  label?: string
  value?: string
  [key: string]: any
}

export const getSelectOptions = (
  options?: Option[],
  existedOption?: Option,
  key: string = 'value',
): Option[] => {
  return _.chain([existedOption])
    .compact() // loại bỏ undefined/null
    .concat(options ?? []) // gộp với options
    .filter((item) => item[key]) // lọc item có key
    .uniqBy(key) // loại trùng theo key
    .value()
}

/**
 * Hàm phân tích chuỗi thời gian thành đối tượng thời gian.
 *
 * @param {string} timeStr - Chuỗi thời gian cần phân tích.
 * @returns {dayjs} - Đối tượng thời gian sau khi phân tích.
 */
const parseTime = (timeStr: string) => {
  /**
   * Kiểm tra định dạng chuỗi thời gian.
   *
   * @param {string} timeStr - Chuỗi thời gian cần kiểm tra.
   * @returns {boolean} - True nếu chuỗi thời gian hợp lệ, false ngược lại.
   */
  if (/^\d{2}:\d{2}$/.test(timeStr)) {
    /**
     * Chuỗi thời gian có định dạng HH:mm.
     *
     * @param {string} timeStr - Chuỗi thời gian cần phân tích.
     * @param {string} format - Định dạng chuỗi thời gian.
     * @returns {dayjs} - Đối tượng thời gian sau khi phân tích.
     */
    return dayjs(timeStr, 'HH:mm')
  } else if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) {
    /**
     * Chuỗi thời gian có định dạng HH:mm:ss.
     *
     * @param {string} timeStr - Chuỗi thời gian cần phân tích.
     * @param {string} format - Định dạng chuỗi thời gian.
     * @returns {dayjs} - Đối tượng thời gian sau khi phân tích.
     */
    return dayjs(timeStr, 'HH:mm:ss')
  }
  /**
   * Chuỗi thời gian không hợp lệ.
   *
   * @returns {dayjs} - Đối tượng thời gian không hợp lệ.
   */
  return dayjs(NaN)
}

/**
 * Hàm định dạng thời gian chỉ gồm giờ và phút.
 *
 * @param {string} rawTime - Thời gian nguyên thủy dưới dạng chuỗi.
 * @returns {string} - Thời gian định dạng chỉ gồm giờ và phút.
 */
export const formatTimeOnlyHourMinute = (rawTime: string) => {
  /**
   * Sử dụng thư viện dayjs để định dạng thời gian.
   *
   * @param {string} rawTime - Thời gian nguyên thủy dưới dạng chuỗi.
   * @param {string} format - Định dạng thời gian.
   * @returns {string} - Thời gian định dạng.
   */
  return dayjs(parseTime(rawTime)).format('HH:mm')
}
export * from './quiz-test/helper'
