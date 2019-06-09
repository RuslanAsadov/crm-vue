import firebase from 'firebase/app'

export default {
  actions: {
    async fetchCategories ({ commit, dispatch }) {
      try {
        const uid = await dispatch('getUid') // получаем id текущего пользователя
        const categories = (await firebase.database().ref(`/users/${uid}/categories`).once('value')).val() || {} // получаем из бд объект категорий
        // const cats = []
        // Object.keys(categories).forEach(catID => {
        //   cats.push({
        //     title: categories[catID].title,
        //     limit: categories[catID].limit,
        //     id: catID
        //   })
        // })
        // return cats

        // Object.keys(categories) вернет массив из id
        // console.log(categories)
        return Object.keys(categories).map(catID => ({ ...categories[catID], id: catID })) // Возвращаем массив вместо объекта и без лишних данных
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async fetchCategoryById ({ commit, dispatch }, id) {
      try {
        const uid = await dispatch('getUid') // получаем id текущего пользователя
        const category = (await firebase.database().ref(`/users/${uid}/categories`).child(id).once('value')).val() || {} // получаем из бд объект категорий
        return { ...category, id }
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async createCategory ({ commit, dispatch }, { limit, title }) {
      try {
        const uid = await dispatch('getUid')
        const category = await firebase.database().ref(`/users/${uid}/categories`).push({ title, limit }) // Добавляем в categories новую категорию, причем key сам сгенерируется
        return { title, limit, id: category.key } // возвращаем то, что нужно на фронтенде
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async updateCategory ({ commit, dispatch }, { id, limit, title }) {
      try {
        const uid = await dispatch('getUid')
        await firebase.database().ref(`/users/${uid}/categories`).child(id).update({ title, limit }) // Обновляем определённой категории поля
      } catch (e) {
        commit('setError', e)
        throw e
      }
    }
  }
}
