<template>
  <div class="col s12 m6 l4">
    <div class="card light-blue bill-card">
      <div class="card-content white-text">
        <span class="card-title">{{ 'billInCurrency' | localize }}</span>

        <p
          class="currency-line"
          v-for="currency in currencies"
          :key="currency"
        >
          <span>{{ getCurrency(currency) | currency(currency) }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['rates', 'currencies'],
  computed: {
    base () {
      return this.$store.getters.info.bill / (this.rates['RUB'] / this.rates['EUR']) // Начальный капитал в Евро
    }
  },
  methods: {
    getCurrency (currency) {
      return Math.floor(this.base * this.rates[currency]) // Начальный капитал в переданой валюте
    }
  }
}
</script>

<style>

</style>
