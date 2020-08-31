const localStorageKeyName = ' tagList';

type TagListModel = {
  data: Tag[];
  fetch: () => Tag[];
  create: (name: string) => 'success' | 'duplicated';
  update: (id: string, name: string) => boolean;
  remove: (id: string) => boolean;
  save: () => void;
}

const tagListModel: TagListModel = {
  data: [],
  fetch() {
    this.data = JSON.parse(window.localStorage.getItem(localStorageKeyName) || '[]');
    return this.data;
  },
  create(name: string) {
    const names = this.data.map(item => item.name);
    if (names.indexOf(name) >= 0) {
      return 'duplicated';
    }
    this.data.push({id: name, name: name});
    this.save();
    return 'success';
  },
  update(id, name) {
    const tag = this.data.filter(item => item.id === id)[0];
    if (tag) {
      tag.name = name;
      tag.id = name;
      this.save();
      return true;
    } else {
      return false;
    }
  },
  remove(id) {
    const tag = this.data.filter(item => item.id === id)[0];
    if (tag) {
      const index = this.data.indexOf(tag);
      this.data.splice(index, 1);
      this.save();
      return true;
    } else {
      return false;
    }
  },
  save() {
    window.localStorage.setItem(localStorageKeyName, JSON.stringify(this.data));

  }
};

export default tagListModel;