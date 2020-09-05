import clone from '@/lib/clone';

const localStorageKeyName = ' recordList';

const recordStore = {
  recordList: [] as RecordItem[],
  fetchRecords() {
    this.recordList = JSON.parse(window.localStorage.getItem(localStorageKeyName) || '[]') as RecordItem[];
    return  this.recordList;
  },
  saveRecords() {
    window.localStorage.setItem(localStorageKeyName, JSON.stringify( this.recordList));
  },
  createRecord(record: RecordItem){
    const recordDeep: RecordItem = clone(record);
    recordDeep.createdAt = new Date().toISOString();
    // if (recordDeep.tags[0]){
      this.recordList &&  this.recordList.push(recordDeep);
    // }else {
    //   window.alert('选择一项标签会更好分类哦')
    // }
    recordStore.saveRecords();
  },
};
recordStore.fetchRecords();

export default recordStore;