import Vue from 'vue';
import Vuex from 'vuex';
import clone from '@/lib/clone';
import createId from '@/lib/createId';

Vue.use(Vuex);


const store = new Vuex.Store({
  state: {
    recordList: [] as RecordItem[],
    tagList: [] as Tag[],
  },
  mutations: {

    fetchRecords(state) {
      return state.recordList = JSON.parse(window.localStorage.getItem('recordList') || '[]') as RecordItem[];
    },
    createRecord(state, record: RecordItem){
      const recordDeep: RecordItem = clone(record);
      recordDeep.createDat = new Date();
      if (recordDeep.tags[0]){
        state.recordList.push(recordDeep);
      }else {
        window.alert('选择一项标签会更好分类哦')
      }
      store.commit('saveRecords')
    },
    saveRecords(state) {
      window.localStorage.setItem('recordList', JSON.stringify( state.recordList));
    },

    fetchTags(state) {
      return state.tagList = JSON.parse(window.localStorage.getItem('tagList') || '[]');
    },
    findTag(state, id: string) {
      return state.tagList.filter(t => t.id === id)[0];
    },
    createTag(state, tagName: string) {
      const name = window.prompt('请输入标签名');
      if (name === '') {
        window.alert('标签名不能为空');
      } else if (name === null) {
        return;
      } else {
        const names = state.tagList.map(item => item.name);
        if (names.indexOf(name) >= 0) {
          window.alert('该标签已存在');
          return;
        }
        const id = createId().toString();
        state.tagList.push({id, name: name});
        store.commit('saveTags');
        window.alert('标签添加成功');
      }
    },
    // removeTag(state, id: string) {
    //   const tag: string = store.commit('findTag', id) || undefined;
    //   if (tag) {
    //     const index = state.tagList.indexOf(tag);
    //     state.tagList.splice(index, 1);
    //     store.commit('saveTags', id);
    //     window.alert('删除成功');
    //     return 'success';
    //   } else {
    //     window.alert('删除失败');
    //     return 'defeated';
    //   }
    // },
    // updateTag(state, {id: string; name: string}) {
    //   const tag = this.findTag(id);
    //   if (tag) {
    //     if (tag.name === name) {
    //       window.alert('标签名未作修改');
    //       return 'duplicated';
    //     } else if (name === '') {
    //       window.alert('标签名不能为空，请重新编辑');
    //       return 'defeated';
    //     } else {
    //       tag.name = name;
    //       this.saveTags();
    //       window.alert('更改成功');
    //       return 'success';
    //     }
    //   } else {
    //     return 'not found';
    //   }
    // },
    saveTags(state) {
      window.localStorage.setItem('tagList', JSON.stringify(state.tagList));
    },
  }
});

export default store;