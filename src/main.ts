import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import Nav from '@/components/Nav.vue';
import Layout from '@/components/Layout.vue';
import Icon from '@/components/Icon.vue';
import tagListModel from '@/models/tagListModel';

Vue.config.productionTip = false;

Vue.component('Nav', Nav);
Vue.component('Layout', Layout);
Vue.component('Icon', Icon);

window.tagList = tagListModel.fetch();
window.createTag = (nameData: string) => {
  const name = window.prompt('请输入标签名');
  if (name) {
    const message = tagListModel.create(name);
    if (message === 'duplicated') {
      window.alert('该标签已存在');
      return;
    } else if (message === 'success') {
      window.alert('标签添加成功');
    }
  } else if (name === '') {
    window.alert('标签名不能为空');
  } else {
    return;
  }
};
window.removeTag = (id: string) => {
  if (tagListModel.remove(id)) {
    window.alert('删除成功');
    return 'success';
  } else {
    window.alert('删除失败');
    return 'defeated';
  }
};
window.updateTag = (id: string, name: string) => {
  const result = tagListModel.update(id, name)
  console.log(result);
  if ( result=== 'success') {
    window.alert('更改成功');
    return 'success';
  } else if ( result=== 'duplicated'){
    window.alert('标签名未作修改');
    return 'duplicated'
  }else if (result=== 'defeated'){
    window.alert('标签名不能为空，请重新编辑');

    return 'defeated'
  }else {
    return 'not found'
  }
};
window.saveTag = ()=>{
  tagListModel.save()
}
window.findTag = (id: string)=>{
  return window.tagList.filter(t => t.id === id)[0];
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
