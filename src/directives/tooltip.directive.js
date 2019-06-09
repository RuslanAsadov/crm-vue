import localizeFilter from '@/filters/localize.filter'

export default {
  bind (el, { value, modifiers }) {
    // eslint-disable-next-line
    M.Tooltip.init(el, {
      html: modifiers.noloc ? value : localizeFilter(value)
    })
  },
  unbind (el) {
    // eslint-disable-next-line
    const tooltip = M.Tooltip.getInstance(el)

    if (tooltip && tooltip.destroy) {
      tooltip.destroy()
    }
  }
}
