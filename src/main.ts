import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

// import Nav from '@/components/Nav.vue';  // 光是这样还不行，这样只是这个文件内能使用这个组件标签
import Nav from '@/components/Nav.vue';

Vue.config.productionTip = false

Vue.component('Nav', Nav) //复制一份Nav组件当中全局组件，这样所有的子组件都能用啦

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
