<template>
  <div>
    <div class="page-title">
      <h3>{{ 'ProfileTitle' | localize }}</h3>
    </div>

    <form class="form" @submit.prevent="submitHandler">
      <div class="input-field">
        <input
            id="description"
            type="text"
            v-model.trim="$v.name.$model"
            :class="{invalid : $v.name.$error}"
        >
        <label for="description">{{ 'Name' | localize }}</label>
        <small v-if="$v.name.$error && !$v.name.required" class="helper-text invalid">{{ 'Message_EnterName' | localize }}</small>
      </div>
      <div class="switch">
        <label>
          English
          <input type="checkbox" v-model="isRuLocale">
          <span class="lever"></span>
          Русский
        </label>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ 'Update' | localize }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { required } from 'vuelidate/lib/validators'

export default {
  metaInfo () {
    return {
      title: this.$title('ProfileTitle')
    }
  },
  data: () => ({
    name: '',
    isRuLocale: true
  }),
  mounted () {
    this.name = this.info.name
    this.isRuLocale = this.info.locale === 'ru-RU'
    setTimeout(() => {
      // eslint-disable-next-line
      M.updateTextFields()
    })
  },
  computed: {
    ...mapGetters(['info'])
  },
  validations: {
    name: { required }
  },
  methods: {
    ...mapActions(['updateInfo']),
    async submitHandler () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      try {
        await this.updateInfo({
          name: this.name,
          locale: this.isRuLocale ? 'ru-RU' : 'en-US'
        })
        this.$message('Успешно обновлено!')
      } catch (e) {}
    }
  }
}
</script>

<style scoped>
.switch{
  margin-bottom: 2rem;
}
</style>
