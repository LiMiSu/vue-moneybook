import Vue from 'vue';
import Vuex from 'vuex';
import clone from '@/lib/clone';
import createId from '@/lib/createId';
import router from '@/router';

Vue.use(Vuex);


const store = new Vuex.Store({
  state: {
    recordList: [],
    tagList: [],
    currentTag: undefined
  } as RootState,

  mutations: {

    fetchRecords(state) {
      state.recordList = JSON.parse(window.localStorage.getItem('recordList') || '[]') as RecordItem[];
    },
    createRecord(state, record: RecordItem) {
      const recordDeep: RecordItem = clone(record);
      recordDeep.createdAt = new Date().toISOString();
      state.recordList.push(recordDeep);
      store.commit('saveRecords');
      window.alert('记账成功')
    },
    saveRecords(state) {
      window.localStorage.setItem('recordList', JSON.stringify(state.recordList));
    },

    setCurrentTag(state, id: string) {
      state.currentTag = state.tagList.filter(t => t.id === id)[0];
    },
    fetchTags(state) {
      state.tagList = JSON.parse(window.localStorage.getItem('tagList') || '[]');
    },
    createTag(state, tagName: string) {
      const name = window.prompt('请输入标签名');
      if (name) {
        const names = state.tagList.map(item => item.name);
        if (names.indexOf(name) >= 0) {
          window.alert('该标签已存在');
        } else {
          const id = createId().toString();
          state.tagList.push({id, name: name});
          store.commit('saveTags');
          window.alert('标签添加成功');
        }
      } else if (name === '') {
        window.alert('标签名不能为空');
      }
    },
    removeTag(state, id: string) {
      const tag = state.tagList.filter(item => item.id === id)[0];
      if (tag) {
        const index = state.tagList.indexOf(tag);
        state.tagList.splice(index, 1);
        store.commit('saveTags', id);
        window.alert('删除成功');
        router.back();
      } else {
        window.alert('删除失败');
      }
    },
    updateTag(state, payload: { id: string; name: string }) {
      const {id, name} = payload;
      const idList = state.tagList.map(item => item.id);
      if (idList.indexOf(id) >= 0) {
        const names = state.tagList.map(item => item.name);
        if (names.indexOf(name) >= 0) {
          window.alert('标签名重复了');
        } else if (name === '') {
          window.alert('标签名不能为空，请重新编辑');
        } else {
          const tag = state.tagList.filter(item => item.id === id)[0];
          tag.name = name;
          store.commit('saveTags');
          window.alert('更改成功');
          router.back();
        }
      }
    },
    saveTags(state) {
      window.localStorage.setItem('tagList', JSON.stringify(state.tagList));
    },
  }
});

export default store;