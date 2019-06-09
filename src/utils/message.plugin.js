import localizeFilter from '@/filters/localize.filter'

export default {
  install (Vue, options) {
    Vue.prototype.$message = function (html) {
      // eslint-disable-next-line
      M.toast({ html })
    }
    Vue.prototype.$error = function (html) {
      // eslint-disable-next-line
      M.toast({ html: `[${localizeFilter('Error')}] ${html}` })
    }
  }
}
