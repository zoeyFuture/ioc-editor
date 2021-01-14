import Vue from 'vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css'

import '@/index'
Vue.config.productionTip = false
Vue.prototype.$eventBus = new Vue()

new Vue({
  render: h => h(App)
}).$mount('#app')
