<template>
  <div>
    <div class="page-title">
      <h3>{{ 'History_title' | localize }}</h3>
    </div>

    <div class="history-chart" v-if="records.length">
      <canvas ref="canvas"></canvas>
    </div>

    <Loader v-if="loading" />

    <p v-else-if="!records.length" class="center">{{ 'NoRecords' | localize }}.
      <router-link to="/record">{{ 'AddNewRecord' | localize }}.</router-link>
    </p>

    <section v-else>
      <HistoryTable :records="items" />
      <Paginate
        v-model="page"
        :page-count="pageCount"
        :click-handler="changePageHandler"
        :prev-text="'Назад'"
        :next-text="'Вперед'"
        :container-class="'pagination'"
        :page-class="'waves-effect'"
      />
    </section>
  </div>
</template>

<script>
import paginationMixin from '@/mixins/pagination.mixin'
import HistoryTable from '@/components/HistoryTable'
import localizeFilter from '@/filters/localize.filter'
import { Pie } from 'vue-chartjs'

export default {
  name: 'history',
  mixins: [paginationMixin],
  extends: Pie,
  metaInfo () {
    return {
      title: this.$title('Menu_History')
    }
  },
  components: {
    HistoryTable
  },
  data: () => ({
    loading: true,
    records: []
  }),
  async mounted () {
    this.records = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')

    this.setup(categories)

    this.loading = false
  },
  methods: {
    setup (categories) {
      this.setupPagination(this.records.map(record => { // вызываем функцию из миксина paginationMixin и передаём в нее объект всех записей
        return {
          ...record,
          categoryName: categories.find(c => c.id === record.categoryID).title, // Забираем title у категории с таким же id как и у рекорда
          typeClass: record.type === 'income' ? 'green' : 'red', // Добавляем класс в зависимости от типа
          typeText: localizeFilter(record.type === 'income' ? 'Income' : 'Outcome') // Добавляем текст в зависимости от типа
        }
      }))

      this.renderChart({
        labels: categories.map(c => c.title), // Выводим названия категорий
        datasets: [{
          label: localizeFilter('OutComesOfCategories'),
          data: categories.map(c => { // возвращаем массив с сумарными тратами по категориям
            return this.records.reduce((total, r) => { // считаем сумму трат для текущей категории "с"
              if (r.categoryID === c.id && r.type === 'outcome') { // если id текущей записи совпадает с id текущей категории "с"
                total += +r.amount
              }
              return total
            }, 0)
          }),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      })
    }
  }
}
</script>
