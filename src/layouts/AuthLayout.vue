<template>
  <div class="grey darken-1 empty-layout">
    <slot></slot>
  </div>
</template>

<script>
import localizeFilter from '@/filters/localize.filter'
import messages from '@/utils/messages'

export default {
  computed: {
    error () {
      return this.$store.getters.error
    }
  },
  watch: {
    error (fbError) {
      this.$error(localizeFilter(messages[fbError.code]))
    }
  }
}
</script>

<style>

</style>
