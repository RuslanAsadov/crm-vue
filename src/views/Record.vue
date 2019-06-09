<template>
  <div>
    <div class="page-title">
      <h3>{{ 'Menu_NewRecord' | localize }}</h3>
    </div>

    <Loader v-if="loading" />

    <p class="center" v-else-if="!categories.length">{{ 'NoCategories' | localize }}. <router-link to="/categories">{{ 'AddNewCategory' | localize }}</router-link></p>

    <form class="form" v-else @submit.prevent="submitHandler">
      <div class="input-field" >
        <select ref="select" v-model="category">
          <option
            v-for="cat in categories"
            :key="cat.id"
            :value="cat.id"
          >{{ cat.title }}</option>
        </select>
        <label>{{ 'Edit_FormSelect' | localize }}</label>
      </div>

      <p>
        <label>
          <input
              class="with-gap"
              name="type"
              type="radio"
              value="income"
              v-model="type"
          />
          <span>{{ 'Income' | localize }}</span>
        </label>
      </p>

      <p>
        <label>
          <input
              class="with-gap"
              name="type"
              type="radio"
              value="outcome"
              v-model="type"
          />
          <span>{{ 'Outcome' | localize }}</span>
        </label>
      </p>

      <div class="input-field">
        <input
            id="amount"
            type="number"
            v-model.number="$v.amount.$model"
            :class="{ invalid: $v.amount.$error }"
        >
        <label for="amount">{{ 'Amount' | localize }}</label>
        <span
          class="helper-text invalid"
          v-if="$v.amount.$error && !$v.amount.required"
        >{{ 'Message_AmountEnter' | localize }}</span>
        <span
          class="helper-text invalid"
          v-if="$v.amount.$error && !$v.amount.minValue"
        >{{ 'Message_AmountNot' | localize }} {{ $v.amount.$params.minValue.min }}</span>
      </div>

      <div class="input-field">
        <input
            id="description"
            type="text"
            v-model="$v.description.$model"
            :class="{ invalid: $v.description.$error }"
        >
        <label for="description">{{ 'Description' | localize }}</label>
        <span
          class="helper-text invalid"
          v-if="$v.description.$error && !$v.description.required"
          >{{ 'Message_DescriptionEnter' | localize }}</span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ 'Create' | localize }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { required, minValue } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'

export default {
  metaInfo () {
    return {
      title: this.$title('Menu_NewRecord')
    }
  },
  data: () => ({
    loading: true,
    categories: [],
    select: null,
    category: null,
    type: 'outcome',
    amount: 1,
    description: ''
  }),
  async mounted () {
    this.categories = await this.$store.dispatch('fetchCategories')
    // форма еще не отрисовалась
    this.loading = false
    // форма отрисовалась, только сейцчас появился селект

    if (this.categories.length) {
      this.category = this.categories[0].id
    }

    // чтобы селект обновился тогда, когда форма уже точно отрисуется используем моментальную асинхронную операцию
    setTimeout(() => {
      // eslint-disable-next-line
      this.select = M.FormSelect.init(this.$refs.select)
      // eslint-disable-next-line
      M.updateTextFields()
    }, 0)
  },
  destroyed () {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  },
  validations: {
    amount: { required, minValue: minValue(1) },
    description: { required }
  },
  methods: {
    async submitHandler () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      if (this.canCreateRecord) {
        try {
          await this.$store.dispatch('createRecord', {
            categoryID: this.category,
            amount: this.amount,
            description: this.description,
            type: this.type,
            date: new Date().toJSON()
          })
          const bill = this.type === 'income'
            ? this.info.bill + this.amount
            : this.info.bill - this.amount

          await this.$store.dispatch('updateInfo', { bill })
          this.$message('Запись успешно создана!')

          this.$v.$reset()
          this.type = 'outcome'
          this.amount = 1
          this.description = ''
          this.category = this.categories[0].id
        } catch (e) {}
        // new Date() Sat Jun 01 2019 18:23:19 GMT+0500 (Екатеринбург, стандартное время)
        // new Date().toJSON() 2019-06-01T13:23:37.879Z
      } else {
        this.$message(`Недостаточно средств на счете (${this.amount - this.info.bill})`)
      }
    }
  },
  computed: {
    ...mapGetters(['info']), // https://vuex.vuejs.org/guide/getters.html#the-mapgetters-helper импортируем геттер info
    canCreateRecord () {
      if (this.type === 'income') {
        return true
      } else {
        return this.info.bill >= this.amount
      }
    }
  }
}
</script>

<style>

</style>
