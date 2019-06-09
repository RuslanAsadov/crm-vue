<template>
  <div>
    <div class="page-title">
      <h3>{{ 'Menu_Categories' | localize }}</h3>
    </div>
    <section>
      <div class="row">
        <CategoryCreate @createdCategory="addNewCategory($event)" />

        <CategoryEdit
          v-if="categories.length"
          :categories="categories"
          @updatedData="updateData"
          :key="categories.length + updateCatEdit"
        />
        <p v-else class="center">{{ 'Message_NoCategories' | localize }}</p>
      </div>
    </section>
  </div>
</template>

<script>
import CategoryCreate from '@/components/CategoryCreate'
import CategoryEdit from '@/components/CategoryEdit'

export default {
  name: 'categories',
  metaInfo () {
    return {
      title: this.$title('Menu_Categories')
    }
  },
  components: {
    CategoryCreate, CategoryEdit
  },
  data: () => ({
    categories: [],
    updateCatEdit: 0
  }),
  async mounted () {
    this.categories = await this.$store.dispatch('fetchCategories') // Получаем категории
  },
  methods: {
    addNewCategory (category) {
      this.categories.push(category) // Добавляем новую категорию в массив
      // this.updateCatEdit++ // Писать не надо , так как categories.length и так станет больше, а от него зависит key
    },
    updateData (updCat) {
      const idx = this.categories.findIndex(c => c.id === updCat.id) // Находим индекс объекта, у которого совпадает id с обновленным id
      this.categories[idx].title = updCat.title
      this.categories[idx].limit = updCat.limit
      this.updateCatEdit++ // Изменяем key чтобы отрисовать его заново (чтобы обновился селект)
    }
  }
}
</script>
