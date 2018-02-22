import * as Vue from "vue"
import * as App from "./components/App.vue"
import {EventHub} from "./components/EventHub"

Vue.config.productionTip = false
Vue.prototype.$eventHub = new EventHub()
// tslint:disable-next-line:no-unused-expression
new Vue(App).$mount("#app")
