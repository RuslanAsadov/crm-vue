<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{ 'Create' | localize }}</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <input
              id="name"
              type="text"
              v-model.trim="$v.title.$model"
              :class="{ 'invalid': $v.title.$error }"
          >
          <label for="name">{{ 'LabelTitle' | localize }}</label>
          <span v-if="$v.title.$error && !$v.title.required" class="helper-text invalid">{{ 'Message_LabelTitle' | localize }}</span>
        </div>

        <div class="input-field">
          <input
              id="limit"
              type="number"
              v-model.trim="$v.limit.$model"
              :class="{ 'invalid': $v.limit.$error }"
          >
          <label for="limit">{{ 'LabelLimit' | localize }}</label>
          <span v-if="$v.limit.$error && !$v.limit.minValue" class="helper-text invalid">{{ 'Message_LabelLimit' | localize }} {{ $v.limit.$params.minValue.min }}</span>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{ 'Create' | localize }}
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
  data: () => ({
    title: '',
    limit: 100
  }),
  methods: {
    async submitHandler () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      try {
        const category = await this.$store.dispatch('createCategory', {
          title: this.title,
          limit: this.limit
        }) // создаем категорию
        this.title = '' // очищаем title
        this.limit = 100 // очищаем лимит
        this.$v.$reset() // сбрасываем валидацию
        this.$message(localizeFilter('CategoryIsCreated'))
        this.$emit('createdCategory', category) // диспачим ивент createdCategory
      } catch (e) {}
    }
  },
  validations: {
    title: { required },
    limit: { minValue: minValue(100) }
  },
  mounted () {
    // eslint-disable-next-line
    M.updateTextFields()
  }
}
</script>

<style>

</style>
