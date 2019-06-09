import firebase from 'firebase/app'

export default {
  state: {
    info: {}
  },
  mutations: {
    setInfo (state, info) {
      state.info = info
    },
    clearInfo (state) {
      state.info = { locale: state.info.locale }
    }
  },
  actions: {
    async fetchInfo ({ dispatch, commit }) {
      try {
        const uid = await dispatch('getUid') // получаем uid
        const info = (await firebase.database().ref(`users/${uid}/info`).once('value')).val() // получаем из бд объект info
        commit('setInfo', info)
      } catch (e) {}
    },
    async updateInfo ({ dispatch, commit, getters }, toUpdate) {
      try {
        const uid = await dispatch('getUid')
        const updateData = { ...getters.info, ...toUpdate } // если передали в toUpdate только bill, то name возьмется из getters.info b наобарот
        await firebase.database().ref(`users/${uid}/info`).update(updateData)
        commit('setInfo', updateData) // обновляем фронтенд
      } catch (error) {
        commit('setError', error)
        throw error
      }
    }
  },
  getters: {
    info: s => s.info
  }
}
