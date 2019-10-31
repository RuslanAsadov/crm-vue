import store from '../store'

export default function dateFilter (value, format = 'date') {
  const options = {}
  value = new Date(value)

  if (format.includes('date')) {
    options.day = '2-digit'
    options.month = 'long'
    options.year = 'numeric'
  }

  if (format.includes('time')) {
    options.hour = '2-digit'
    options.minute = '2-digit'
    options.second = '2-digit'
  }
  const locale = store.getters.info.locale

  return new Intl.DateTimeFormat(locale, options).format(value)
}