import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'

dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)

// For week key like "27" => "1 Jul – 7 Jul"
export const formatWeekRange = (week) => {
  const year = new Date().getFullYear()
  const startOfWeek = dayjs().year(year).isoWeek(week).startOf('isoWeek')
  const endOfWeek = startOfWeek.endOf('isoWeek')

  return `${startOfWeek.format('D MMM')} – ${endOfWeek.format('D MMM')}`
}

// For month key like "7" => "July"
export const formatMonthRange = (month) => {
  return dayjs().month(month - 1).format('MMMM') // month is 0-indexed
}
