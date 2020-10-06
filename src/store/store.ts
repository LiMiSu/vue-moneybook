import Vue from 'vue';
import Vuex from 'vuex';
import clone from '@/lib/clone';
import createId from '@/lib/createId';
import tagInit from '@/constants/tagInit';
import dayjs from 'dayjs';
import createRecordId from '@/lib/createRecordId';

Vue.use(Vuex);


const store = new Vuex.Store({
  state: {
    record: {
      tag: {
        id: '',
        name: '',
        tagicon: '',
        type: ''
      },
      id: '',
      notes: '',
      type: '' + '-',
      amount: 0,
      createdAt: new Date().toISOString()
    },
    recordList: [],
    tagList: [],
    dayRecordList: [],
    monthRecordList: [],
    yearRecordList: [],
    currentTag: '',
    currentRecord: {
      tag: {
        id: '',
        name: '',
        tagicon: '',
        type: ''
      },
      id: '',
      notes: '',
      type: '' + '-',
      amount: 0,
      createdAt: new Date().toISOString()
    },
    isHave: true,
    showBody: false,
    showAdd: false,
    showtype: false,
    chooseYear: '',
    chooseMonth: '',
    interval: 'month',
    isDeleteAll: false,
    isSucceed: '',
    noAction: false,
    isFail: '',
    go: 0,
    circleShowDate: '',
    showLineEcharts: true,
    isSucce: 0,
  } as RootState,

  mutations: {

    fetchRecords(state) {
      state.recordList = JSON.parse(window.localStorage.getItem('recordList') || '[]') as RecordItem[];
    },
    createRecord(state, record: RecordItem) {
      record.id = createRecordId().toString();
      if (record.type === '-') {
        record.amount = -record.amount;
      }
      const recordDeep: RecordItem = clone(record);
      if (!recordDeep.amount || recordDeep.amount === 0) {
        state.isFail = '请输入金额';
        return;
      }
      state.recordList.push(recordDeep);
      store.commit('saveRecords');
      state.isSucceed = '记账成功！';
    },
    saveRecords(state) {
      window.localStorage.setItem('recordList', JSON.stringify(state.recordList));
    },

    setCurrentTag(state, id: string) {
      state.currentTag = state.tagList.filter(t => t.id === id)[0];
    },
    setCurrentRecord(state, id: string) {
      state.currentRecord = state.recordList.filter(t => t.id === id)[0];
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
        state.isSucceed = '标签删除成功！';
        state.isSucce++
      } else {
        state.isFail = '标签删除失败';
      }
    },
    updateTag(state, payload: { id: string; name: string; tagicon: string }) {
      const {id, name, tagicon} = payload;
      const idList = state.tagList.map(item => item.id);
      if (idList.indexOf(id) >= 0) {
        const names = state.tagList.map(item => item.name);
        const icon = (state.currentTag as Tag).tagicon;
       if (name === '') {
          state.isFail = '标签名不能为空，请重新编辑';
        } else {
          const tag = state.tagList.filter(item => item.id === id)[0];
          tag.name = name;
          store.commit('saveTags');
          state.isSucceed = '标签编辑成功！';
          store.commit('setGo', -1);
          state.isSucce++
        }
      }
    },
    saveTags(state) {
      window.localStorage.setItem('tagList', JSON.stringify(state.tagList));
    },

    createdDayRecordList(state, payload: { recordList: RecordItem[]; type: string }) {
      const {recordList, type} = payload;
      const newRecordList: RecordItem[] = type === '1' ? clone(recordList)
        .sort((a: RecordItem, b: RecordItem) =>
          dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
        ) : clone(recordList)
        .filter((item) => item.type === type)
        .sort((a: RecordItem, b: RecordItem) =>
          dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
        );
      if (newRecordList.length === 0) {
        return [];
      }
      const dayResult: DayResult[] = [{
        string: 'day',
        show: true,
        title: dayjs(newRecordList[0].createdAt).format('YYYY-M-DD'),
        items: [newRecordList[0]]
      }];
      for (let i = 1; i < newRecordList.length; i++) {
        const current = newRecordList[i];
        const last = dayResult[dayResult.length - 1];
        if (dayjs(last.title).isSame(dayjs(current.createdAt), 'day')) {
          last.items.push(current);
        } else {
          dayResult.push({
            string: 'day',
            show: true,
            title: dayjs(current.createdAt).format('YYYY-M-DD'),
            items: [current]
          });
        }
      }
      dayResult.forEach(group => {
        group.total = group.items.reduce((sum, item) => {
          return sum + item.amount;
        }, 0);
      });
      state.dayRecordList = dayResult;
    },
    createdMonthRecordList(state, payload: { dayRecordList: DayResult[]; type: string }) {
      const {dayRecordList, type} = payload;
      const newRecordList: DayResult[] = clone(dayRecordList)
        // .filter(item => item.items.filter(item => item.type === type))
        .sort((a: DayResult, b: DayResult) =>
          dayjs(b.title).valueOf() - dayjs(a.title).valueOf()
        );
      if (newRecordList.length === 0) {
        return [];
      }
      const monthResult: MonthResult[] = [{
        string: 'month',
        show: true,
        title: dayjs(newRecordList[0].title).format('YYYY-M'),
        items: [newRecordList[0]]
      }];
      for (let i = 1; i < newRecordList.length; i++) {
        const current = newRecordList[i];
        const last = monthResult[monthResult.length - 1];
        if (dayjs(last.title).isSame(dayjs(current.title), 'month')) {
          last.items.push(current);
        } else {
          monthResult.push({
            string: 'month',
            show: true,
            title: dayjs(current.title).format('YYYY-M'),
            items: [current]
          });
        }
      }
      monthResult.forEach(group => {
        group.total = group.items.reduce((sum, item) => {
          return sum + item.total!;
        }, 0);
      });
      state.monthRecordList = monthResult;
    },
    createdYearRecordList(state, payload: { monthRecordList: MonthResult[]; type: string }) {
      const {monthRecordList, type} = payload;
      const newRecordList: MonthResult[] = clone(monthRecordList)
        // .filter(item => item.items.filter(item => item.items.filter(item=>item.type === type)))
        .sort((a: MonthResult, b: MonthResult) =>
          dayjs(b.title).valueOf() - dayjs(a.title).valueOf()
        );
      if (newRecordList.length === 0) {
        return [];
      }
      const yearResult: YearResult[] = [{
        string: 'year',
        show: true,
        title: dayjs(newRecordList[0].title).format('YYYY'),
        items: [newRecordList[0]]
      }];
      for (let i = 1; i < newRecordList.length; i++) {
        const current = newRecordList[i];
        const last = yearResult[yearResult.length - 1];
        if (dayjs(last.title).isSame(dayjs(current.title), 'year')) {
          last.items.push(current);
        } else {
          yearResult.push({string: 'year', show: true, title: dayjs(current.title).format('YYYY'), items: [current]});
        }
      }
      yearResult.forEach(group => {
        group.total = group.items.reduce((sum, item) => {
          return sum + item.total!;
        }, 0);
      });
      state.yearRecordList = yearResult;
    },

    fetchChooseMonth(state) {
      state.chooseMonth = state.record.createdAt;
    },
    fetchChooseYear(state) {
      state.chooseYear = state.record.createdAt;
    },
    saveGo(state) {
      window.localStorage.setItem('go', state.go.toString());
    },
    fetchGo(state) {
      state.go = parseInt(window.localStorage.getItem('go') || '0');
    },
    setGo(state, value) {
      state.go += value;
      store.commit('saveGo');
    }
  }
});

export default store;