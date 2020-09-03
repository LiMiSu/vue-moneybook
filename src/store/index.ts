import Vue from 'vue';
import Vuex from 'vuex';
import clone from '@/lib/clone';

Vue.use(Vuex);


const store = new Vuex.Store({
  state: {
    recordList: [] as RecordItem[],
  },
  mutations: {
    fetchRecords(state) {
      state.recordList = JSON.parse(window.localStorage.getItem('recordList') || '[]') as RecordItem[];
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
  }
});

export default store;