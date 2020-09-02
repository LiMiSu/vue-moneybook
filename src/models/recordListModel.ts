import clone from '@/lib/clone';

const localStorageKeyName = ' recordList';

const recordListModel = {
  data: [] as RecordItem[],
  fetch() {
    this.data = JSON.parse(window.localStorage.getItem(localStorageKeyName) || '[]') as RecordItem[];
    return this.data;
  },
  create(record: RecordItem){
    const recordDeep: RecordItem =clone(record);
    recordDeep.createDat = new Date();
    this.data.push(recordDeep);
    this.save()
  },
  save() {
    window.localStorage.setItem(localStorageKeyName, JSON.stringify(this.data));
  }
};

export default recordListModel;