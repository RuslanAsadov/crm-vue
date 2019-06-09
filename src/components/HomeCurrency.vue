<template>
  <div class="col s12 m6 l8">
    <div class="card orange darken-3 bill-card">
      <div class="card-content white-text">
        <div class="card-header">
          <span class="card-title">{{ 'Exchange_Rates' | localize }}</span>
        </div>
        <table>
          <thead>
          <tr>
            <th>{{ 'Currency' | localize }}</th>
            <th>{{ 'Rate' | localize }}</th>
            <th>{{ 'Date' | localize }}</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="cur in currencies" :key="cur">
            <td>{{ cur }}</td>
            <td>{{ toRub(cur) }}</td>
            <td>{{ date | date}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['rates', 'date', 'currencies'],
  methods: {
    toRub (cur) {
      return (this.rates['RUB'] / this.rates[cur]).toFixed(2)
    }
  }
}
</script>

<style>

</style>
