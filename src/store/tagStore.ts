import createId from '@/lib/createId';

const localStorageKeyName = ' tagList';

const tagStore = {
  tagList: [] as Tag[],
  fetchTags() {
    this.tagList = JSON.parse(window.localStorage.getItem(localStorageKeyName) || '[]');
    return this.tagList;
  },



  findTag: function (id: string) {
    return this.tagList.filter(t => t.id === id)[0];
  },
  createTag(tagName: string) {
    const name = window.prompt('请输入标签名');
    if (name === '') {
      window.alert('标签名不能为空');
    } else if (name === null) {
      return;
    } else {
      const names = this.tagList.map(item => item.name);
      if (names.indexOf(name) >= 0) {
        window.alert('该标签已存在');
        return;
      }
      const id = createId().toString();
      this.tagList.push({id, name: name});
      this.saveTags();
      window.alert('标签添加成功');
    }
  },
  removeTag(id: string) {
    const tag = this.findTag(id);
    if (tag) {
      const index = this.tagList.indexOf(tag);
      this.tagList.splice(index, 1);
      this.saveTags();
      window.alert('删除成功');
      return 'success';
    } else {
      window.alert('删除失败');
      return 'defeated';
    }
  },
  updateTag(id: string, name: string) {
    const tag = this.findTag(id);
    if (tag) {
      if (tag.name === name) {
        window.alert('标签名未作修改');
        return 'duplicated';
      } else if (name === '') {
        window.alert('标签名不能为空，请重新编辑');
        return 'defeated';
      } else {
        tag.name = name;
        this.saveTags();
        window.alert('更改成功');
        return 'success';
      }
    } else {
      return 'not found';
    }
  },
  saveTags() {
    window.localStorage.setItem(localStorageKeyName, JSON.stringify(this.tagList));
  },
};
tagStore.fetchTags();
export default tagStore;