import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Paginate from 'vuejs-paginate'
import VueMeta from 'vue-meta'
import firebase from 'firebase/app'
import App from './App.vue'
import router from './router'
import store from './store'
import dateFilter from './filters/date.filter'
import currencyFilter from './filters/currency.filter'
import localizeFilter from './filters/localize.filter'
import tooltipDirective from './directives/tooltip.directive'
import messagePlugin from './utils/message.plugin'
import titlePlugin from './utils/title.plugin'
import Loader from './components/app/Loader'
import './registerServiceWorker'
import 'materialize-css/dist/js/materialize.min.js'
import 'firebase/auth'
import 'firebase/database'

Vue.use(messagePlugin)
Vue.use(titlePlugin)
Vue.use(Vuelidate)
Vue.use(VueMeta)
Vue.filter('date', dateFilter)
Vue.filter('currency', currencyFilter)
Vue.filter('localize', localizeFilter)
Vue.directive('tooltip', tooltipDirective)
Vue.component('Loader', Loader)
Vue.component('Paginate', Paginate)
Vue.config.productionTip = false

firebase.initializeApp({
  apiKey: 'AIzaSyA-X2__lqkAm3u_p-I_VrPKvwsasa1LqT0',
  authDomain: 'crm-my-vue.firebaseapp.com',
  databaseURL: 'https://crm-my-vue.firebaseio.com',
  projectId: 'crm-my-vue',
  storageBucket: 'crm-my-vue.appspot.com',
  messagingSenderId: '798103009154',
  appId: '1:798103009154:web:51c2c692c86cde24'
})

let app

firebase.auth().onAuthStateChanged(() => { // Чтобы vue сразу не отрисовывал (так как изначально не известно, вошел ли юзер), он ждет пока не узнает, активна ли сессия либо нет. Ищет данные пользователя
  if (!app) { // сработает только при первой загрузке, т.к. потом не будет undefined
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
