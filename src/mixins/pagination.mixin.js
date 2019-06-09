import _ from 'lodash'

export default {
  data () {
    return {
      page: +this.$route.query.page || 1, // текущая страница
      pageSize: 5, // кол-во элкмкнтов на странице
      pageCount: 0, // кол-во страниц
      allItems: [], // все элементы
      items: [] // текущие элементы для данной страницы
    }
  },
  methods: {
    setupPagination (allItems) {
      this.allItems = _.chunk(allItems, this.pageSize) // Разбиваем массив по нужному кол-ву элементов, которые будут показываться на одной странице
      this.pageCount = _.size(this.allItems) // высчитываем кол-во массивов в массиве, т.е. кол-во страниц
      this.items = this.allItems[this.page - 1] || this.allItems[0] // получаем массив нужной страницы. Т.к. страница первая, индекс с нуля
    },
    changePageHandler (page) {
      this.$router.push(`${this.$route.path}?page=${page}`)
      this.items = this.allItems[page - 1] || this.allItems[0] // получаем массив нужной страницы. Т.к. страница первая, индекс с нуля
    }
  }
}
