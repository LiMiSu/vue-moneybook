import Vue from 'vue';
import Vuex from 'vuex';
import clone from '@/lib/clone';
import createId from '@/lib/createId';
import router from '@/router';

Vue.use(Vuex);


const store = new Vuex.Store({
  state: {
    record: {tags: [], notes: '', type: '-', amount: 0, createdAt: new Date().toISOString()},
    recordList: [],
    tagList: [],
    currentTag: undefined,
    isHave: true,
    changeShow: false,
    showBody: false,
  } as RootState,

  mutations: {

    fetchRecords(state) {
      state.recordList = JSON.parse(window.localStorage.getItem('recordList') || '[]') as RecordItem[];
    },
    createRecord(state, record: RecordItem) {
      const recordDeep: RecordItem = clone(record);
      // recordDeep.createdAt = new Date().toISOString();
      recordDeep.createdAt = recordDeep.createdAt || new Date().toISOString();
      // if (!recordDeep.tags || recordDeep.tags.length === 0) {
      //   return window.alert('选择一项标签会更好分类哦');
      // }
      if (!recordDeep.amount || recordDeep.amount === 0) {
        return window.alert('请输入金额');
      }
      state.recordList.push(recordDeep);
      store.commit('saveRecords');
      window.alert('记账成功');
    },
    saveRecords(state) {
      window.localStorage.setItem('recordList', JSON.stringify(state.recordList));
    },

    setCurrentTag(state, id: string) {
      state.currentTag = state.tagList.filter(t => t.id === id)[0];
    },
    fetchTags(state) {
      state.tagList = JSON.parse(window.localStorage.getItem('tagList') || '[]');
      if (!state.tagList || state.tagList.length === 0) {
        store.commit('createTag', {name: '衣', tagicon: 'date', type: state.record.type});
        store.commit('createTag', {name: '食', tagicon: 'date', type: state.record.type});
        store.commit('createTag', {name: '住', tagicon: 'label', type: state.record.type});
        store.commit('createTag', {name: '行', tagicon: 'money', type: state.record.type});
      }
    },
    createTag(state, payload: { name: string; tagicon: string; type: string }) {
      const {name, tagicon, type} = payload;
      state.isHave = true;
      const names = state.tagList.map(item => item.name);
      if (names.indexOf(name) >= 0) {
        state.isHave = false;
      } else {
        const id = createId().toString();
        state.tagList.push({id, name: name, tagicon: tagicon, type: type});
        store.commit('saveTags');
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
    updateTag(state, payload: { id: string; name: string; tagIcon: string }) {
      const {id, name, tagIcon} = payload;
      const idList = state.tagList.map(item => item.id);
      if (idList.indexOf(id) >= 0) {
        const names = state.tagList.map(item => item.name);
        if (names.indexOf(name) >= 0) {
          window.alert('标签名未作修改');
        } else if (name === '') {
          window.alert('标签名不能为空，请重新编辑');
        } else {
          const tag = state.tagList.filter(item => item.id === id)[0];
          tag.name = name;
          tag.tagicon = tagIcon;
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