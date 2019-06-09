import store from '../store'
import ru from '../locales/ru.json'
import en from '../locales/en.json'

const locales = {
  'ru-RU': ru,
  'en-US': en
}

export default function localizeFilter (key) { // принимаем ключ (единственное название поля, которое нужно локализировать)
  const locale = store.getters.info.locale || 'ru-RU' // получаем нужную локаль
  return locales[locale][key] || `[Localize error]: key ${key} is not found` // ищем в нужной локали по ключу результат, который нужно вывести
}
