<template>
  <div>
    <Loader v-if="loader" />
    <div class="app-main-layout" v-else>
      <Navbar @click="isOpen = !isOpen" />

      <Sidebar v-model="isOpen" :key="locale" />

      <main class="app-content" :class="{ 'full': !isOpen }">
        <div class="app-page">
          <slot></slot>
        </div>
      </main>

      <div class="fixed-action-btn" :key="locale + '1'">
        <router-link class="btn-floating btn-large blue" to="/record" v-tooltip="'CreateNewRecord'" data-position="left">
          <i class="large material-icons">add</i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/app/Navbar'
import Sidebar from '@/components/app/Sidebar'
import localizeFilter from '@/filters/localize.filter'
import messages from '@/utils/messages'

export default {
  components: {
    Navbar, Sidebar
  },
  data () {
    return {
      isOpen: true,
      loader: true
    }
  },
  async mounted () {
    if (!Object.keys(this.$store.getters.info).length) { // если объект info ПУСТОЙ то получаем информацию
      await this.$store.dispatch('fetchInfo')
    }

    this.loader = false
  },
  computed: {
    error () {
      return this.$store.getters.error
    },
    locale () {
      return this.$store.getters.info.locale
    }
  },
  watch: {
    error (fbError) {
      this.$error(localizeFilter(messages[fbError.code]) | 'Что-то пошло не так')
    }
  }

}
</script>

<style>

</style>
