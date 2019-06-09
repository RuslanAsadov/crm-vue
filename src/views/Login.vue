<template>
  <form class="card auth-card" @submit.prevent="submitHandler">
    <div class="card-content">
      <span class="card-title">{{ 'Site_Title' | localize }}</span>
      <div class="input-field">
        <input
            id="email"
            type="text"
            v-model.trim="$v.email.$model"
            :class="{invalid : $v.email.$error}"
        >
        <label for="email">Email</label>
        <small
          v-if="$v.email.$error && !$v.email.required"
          class="helper-text invalid">{{ 'Message_EnterEmail' | localize }}
        </small>
        <small
          v-else-if="$v.email.$error && !$v.email.email"
          class="helper-text invalid">{{ 'Message_BadEmail' | localize }}
        </small>
      </div>
      <div class="input-field">
        <input
            id="password"
            type="password"
            v-model.trim="$v.password.$model"
            :class="{invalid : $v.password.$error}"
        >
        <label for="password">{{ 'Password' | localize }}</label>
        <small v-if="$v.password.$error && !$v.password.required"
          class="helper-text invalid">{{ 'Message_Password' | localize }}
        </small>
        <small v-if="$v.password.$error && !$v.password.minLength"
          class="helper-text invalid">{{ 'Message_BadPassword' | localize }} {{ $v.password.$params.minLength.min }}
        </small>
      </div>
    </div>
    <div class="card-action">
      <div>
        <button
            class="btn waves-effect waves-light auth-submit"
            type="submit"
            :disabled="$v.$invalid"
        >
          {{ 'Login_text' | localize }}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        {{'NoAccount' | localize}}
        <router-link to="/register">{{ 'Register_text' | localize }}</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import { email, required, minLength } from 'vuelidate/lib/validators'
import messages from '@/utils/messages'
import localizeFilter from '@/filters/localize.filter'

export default {
  name: 'login',
  metaInfo () {
    return {
      title: this.$title('Login_text')
    }
  },
  methods: {
    async submitHandler () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      const formData = {
        email: this.email,
        password: this.password
      }

      try {
        await this.$store.dispatch('login', formData)
        this.$router.push('/') // редирект если не возвр. ошибка
      } catch (e) {}
    }
  },
  data () {
    return {
      email: '',
      password: ''
    }
  },
  validations: {
    email: { email, required },
    password: { required, minLength: minLength(6) }
  },
  mounted () {
    if (messages[this.$route.query.message]) {
      this.$message(localizeFilter(messages[this.$route.query.message]))
    }
  }
}
</script>

<style>

</style>
