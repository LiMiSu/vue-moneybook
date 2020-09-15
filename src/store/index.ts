import Vue from 'vue';
import Vuex from 'vuex';
import clone from '@/lib/clone';
import createId from '@/lib/createId';
import router from '@/router';
import tagInit from '@/constants/tagInit';
import dayjs from 'dayjs';

Vue.use(Vuex);


const store = new Vuex.Store({
  state: {
    record: {tags: [], notes: '', type: '-', amount: 0, createdAt: new Date().toISOString()},
    recordList: [],
    tagList: [],
    dayRecordList: [],
    currentTag: undefined,
    isHave: true,
    showBody: false,
    numberShow: false
  } as RootState,

  mutations: {

    fetchRecords(state) {
      state.recordList = JSON.parse(window.localStorage.getItem('recordList') || '[]') as RecordItem[];
    },
    createRecord(state, record: RecordItem) {
      const recordDeep: RecordItem = clone(record);
      if (!recordDeep.tags || recordDeep.tags.length === 0) {
        return window.alert('选择一项标签会更好分类哦');
      }
      if (!recordDeep.amount || recordDeep.amount === 0) {
        return window.alert('请输入金额');
      }
      state.recordList.push(recordDeep);
      store.commit('saveRecords');
      window.alert('记账成功');
    },
    saveRecords(state) {
      window.localStorage.setItem('recordList', JSON.stringify(state.recordList));
      store.commit('updateDayRecordList');
    },

    setCurrentTag(state, id: string) {
      state.currentTag = state.tagList.filter(t => t.id === id)[0];
    },
    fetchTags(state) {
      state.tagList = JSON.parse(window.localStorage.getItem('tagList') || '[]');
      if (!state.tagList || state.tagList.length === 0) {
        tagInit.forEach(item => {
          return store.commit('createTag', {name: item.name, tagicon: item.tagicon, type: item.type});
        });

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
    updateTag(state, payload: { id: string; name: string }) {
      const {id, name} = payload;
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
          store.commit('saveTags');
          window.alert('更改成功');
          router.replace('/managetag').then();
        }
      }
    },
    saveTags(state) {
      window.localStorage.setItem('tagList', JSON.stringify(state.tagList));
    },

    //按天
    fetchDayRecordList(state) {
      state.dayRecordList = JSON.parse(window.localStorage.getItem('dayRecordList') || '[]') as Result[];
    },
    updateDayRecordList(state, recordList) {
      const newRecordList: any = clone(recordList);
      newRecordList.filter((item: RecordItem) => (item as any).type === this.type)
        .sort((a: RecordItem, b: RecordItem) =>
          dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
        );
      if (newRecordList.length === 0) {
        return [];
      }

      const result: Result[] = [{
        title: dayjs(newRecordList[0].createdAt).format('YYYY-M-D'),
        items: [newRecordList[0]]
      }];
      for (let i = 1; i < newRecordList.length; i++) {
        const current = newRecordList[i];
        const last = result[result.length - 1];
        if (dayjs(last.title).isSame(dayjs(current.createdAt), 'day')) {
          last.items.push(current);
        } else {
          result.push({title: dayjs(current.createdAt).format('YYYY-M-D'), items: [current]});
        }
      }
      result.forEach(group => {
        group.total = group.items.reduce((sum, item) => {
          return sum + item.amount;
        }, 0);
      });
      state.dayRecordList = result;
      store.commit('saveDayRecordList');
    },
    saveDayRecordList(state) {
      window.localStorage.setItem('dayRecordList', JSON.stringify(state.dayRecordList));
    },

    //按周
    //按月
    //按年

  }
});

export default store;