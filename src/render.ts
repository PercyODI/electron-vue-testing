import * as Vue from 'vue'
import * as App from './components/App.vue'

Vue.config.productionTip = false
Vue.prototype.$eventHub = new Vue();
// tslint:disable-next-line:no-unused-expression
new Vue(App).$mount('#app')
