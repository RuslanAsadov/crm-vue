<template>
  <div>
    <div class="page-title">
      <h3>{{ 'Menu_Planning' | localize }}</h3>
      <h4>{{ info.bill | currency }}</h4>
    </div>

    <Loader v-if="loading" />

    <p class="center" v-else-if="!categories.length">{{ 'NoCategories' | localize }}. <router-link to="/categories">{{ 'AddNewCategory' | localize }}</router-link></p>

    <section v-else>
      <div v-for="cat in categories" :key="cat.id" v-tooltip.noloc="cat.tooltip">
        <p>
          <strong>{{ cat.title }}</strong>
          {{ cat.spend | currency }} из {{ cat.limit | currency }}
        </p>
        <div class="progress">
          <div
              class="determinate"
              :class="[ cat.progressColor ]"
              :style="{ width: cat.progressPercent + '%' }"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import currencyFilter from '@/filters/currency.filter' // Импортируем фильтр
import localizeFilter from '@/filters/localize.filter'

export default {
  name: 'planning',
  metaInfo () {
    return {
      title: this.$title('Menu_Planning')
    }
  },
  data: () => ({
    loading: true,
    categories: []
  }),
  async mounted () {
    const records = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')

    this.categories = categories.map(cat => { // изменяем массив categories, добавляем доп. данные, итерируя по каждому элементу в массиве
      const spend = records // Находим сколько всего потрачено
        .filter(r => r.categoryID === cat.id) // Находим именно тот рекорд, который относится к этой категории
        .filter(r => r.type === 'outcome') // Находим из них траты
        .reduce((accumulator, record) => { // пробегает по массиву и суммирует в accumulator, record - тек. элемент массива
          return (accumulator += +record.amount) // плюсуем amount у всех подходящих recordов. "+" чтобы наверняка проверить, что integer
        }, 0) // Если массив был пустой, то вернёт начальное значение (0)

      const percent = 100 * spend / cat.limit // находим отношение потраченного к максимально возможно потраченному
      const progressPercent = percent > 100 ? 100 : percent // если превышает, то 100

      const tooltipValue = cat.limit - spend
      const tooltip = `${tooltipValue < 0 ? localizeFilter('More_than') : localizeFilter('Stayed')} ${currencyFilter(Math.abs(tooltipValue))}` // abs - модуль

      const progressColor = percent < 60
        ? 'green'
        : percent < 100
          ? 'yellow'
          : 'red'

      return {
        ...cat, progressPercent, progressColor, spend, tooltip
      }
    })

    this.loading = false
  },
  computed: {
    ...mapGetters(['info'])
  }
}
</script>

<style>

</style>
