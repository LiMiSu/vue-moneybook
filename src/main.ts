import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Nav from '@/components/Nav.vue';
import Layout from '@/components/Layout.vue';
import Icon from '@/components/Icon.vue';
import tagListModel from '@/models/tagListModel';
Vue.config.productionTip = false

Vue.component('Nav', Nav)
Vue.component('Layout', Layout)
Vue.component('Icon',Icon)

window.tagList = tagListModel.fetch();
window.createTag = (nameData: string) => {
  const name = window.prompt('请输入标签名');
  if (name) {
    const message = tagListModel.create(name);
    if (message === 'duplicated') {
      window.alert('该标签已存在');
    }else if (message==='success'){
      window.alert('标签添加成功')
    }
  }else if (name===''){
    window.alert('标签名不能为空')
  }else {
    return
  }
}




new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
