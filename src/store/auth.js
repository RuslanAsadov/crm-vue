import firebase from 'firebase/app'

export default {
  actions: {
    async login ({ dispatch, commit }, { email, password }) {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password) // пытаемся залогиниться
      } catch (e) {
        commit('setError', e) // если нет, то выбрасываем ошибку, вызывая мутацию setError
        throw e
      }
    },
    async register ({ commit, dispatch }, { email, password, name }) {
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password) // создаем аккаунт
        const uid = await dispatch('getUid') // получаем uid у текущего пользователя (которого только создали)
        await firebase.database().ref(`/users/${uid}/info`).set({
          bill: 100000,
          name,
          locale: 'ru-RU'
        }) // добавляем в бд
      } catch (e) {
        commit('setError', e) // если нет, то выбрасываем ошибку, вызывая мутацию setError
        throw e // чтобы компанент понял, что была ошибка (сработал catch в компоненте)
      }
    },
    getUid () {
      const user = firebase.auth().currentUser // получаем объект текущего юзера
      return user ? user.uid : null // если юзер есть, то забираем у него uid
    },
    async logout ({ commit }) {
      await firebase.auth().signOut() // выходим из текущей сессии
      commit('clearInfo') // очищаем объект info
    }
  }
}
