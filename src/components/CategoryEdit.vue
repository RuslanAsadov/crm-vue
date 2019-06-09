<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{ 'EditTitle' | localize }}</h4>
      </div>
      <form @submit.prevent="submitHandeler">
        <div class="input-field" >
          <select ref="select" v-model="current">
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >{{ category.title }}</option>
          </select>
          <label>{{ 'Edit_FormSelect' | localize }}</label>
        </div>

        <div class="input-field">
          <input
              id="new-name"
              type="text"
              v-model.trim="$v.title.$model"
              :class="{ 'invalid': $v.title.$error }"
          >
          <label for="new-name">{{ 'LabelTitle' | localize }}</label>
          <span v-if="$v.title.$error && !$v.title.required" class="helper-text invalid">{{ 'Message_LabelTitle' | localize }}</span>
        </div>

        <div class="input-field">
          <input
              id="new-limit"
              type="number"
              v-model.trim="$v.limit.$model"
              :class="{ 'invalid': $v.limit.$error }"
          >
          <label for="new-limit">{{ 'LabelLimit' | localize }}</label>
          <span v-if="$v.limit.$error && !$v.limit.minValue" class="helper-text invalid">{{ 'Message_LabelLimit' | localize }} {{ $v.limit.$params.minValue.min }}</span>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{ 'Update' | localize }}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { required, minValue } from 'vuelidate/lib/validators'
import localizeFilter from '@/filters/localize.filter'

export default {
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    select: null,
    title: '',
    limit: 100,
    current: null
  }),
  validations: {
    title: { required },
    limit: { minValue: minValue(100) }
  },
  mounted () {
    // eslint-disable-next-line
    this.select = M.FormSelect.init(this.$refs.select)
    // eslint-disable-next-line
    M.updateTextFields()
  },
  destroyed () {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  },
  created () {
    const { id, title, limit } = this.categories[0] // categories будет доступен сразу,так как родительский комп. создает этот только тогда, когда есть categories
    this.current = id // задаем селект по умолчанию
    this.title = title
    this.limit = limit
  },
  methods: {
    async submitHandeler () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      try {
        const categoryData = {
          id: this.current,
          title: this.title,
          limit: this.limit
        }
        await this.$store.dispatch('updateCategory', categoryData) // Обновляем категорию
        this.$message(localizeFilter('CategoryIsUpdated'))
        this.$emit('updatedData', categoryData)
      } catch (e) {
        this.$error(localizeFilter('CategoryIsNotUpdated'))
      }
    }
  },
  watch: {
    current (catId) { // при изменении селекта
      const { title, limit } = this.categories.find(c => c.id === catId) // находим выбраный селектом элемент
      this.title = title
      this.limit = limit
    }
  }
}
</script>
