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
      <div class="input-field">
        <input
            id="name"
            type="text"
            v-model.trim="$v.name.$model"
            :class="{invalid : $v.name.$error}"
        >
        <label for="name">{{ 'Name' | localize }}</label>
        <small v-if="$v.name.$error && !$v.name.required" class="helper-text invalid">{{ 'Message_EnterName' | localize }}</small>
      </div>
      <p>
        <label>
          <input type="checkbox" v-model.trim="$v.agree.$model" :class="{invalid : $v.agree.$error}" />
          <span>{{ 'AgreeRules' | localize }}</span>
        </label>
      </p>
    </div>
    <div class="card-action">
      <div>
        <button
            class="btn waves-effect waves-light auth-submit"
            type="submit"
            :disabled="$v.$invalid"
        >
          {{ 'Register_text' | localize }}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        {{ 'Already_have_an_account' | localize }}
        <router-link to="/login">{{ 'Login_text' | localize }}</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import { email, required, minLength } from 'vuelidate/lib/validators'

export default {
  metaInfo () {
    return {
      title: this.$title('Register_text')
    }
  },
  name: 'register',
  data () {
    return {
      email: '',
      password: '',
      name: '',
      agree: false
    }
  },
  validations: {
    email: { email, required },
    password: { required, minLength: minLength(6) },
    name: { required },
    agree: { checked: v => v }
  },
  methods: {
    async submitHandler () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      const formData = {
        email: this.email,
        password: this.password,
        name: this.name
      }
      try {
        await this.$store.dispatch('register', formData)
        this.$router.push('/')
      } catch (e) {}
    }
  }
}
</script>

<style>

</style>
