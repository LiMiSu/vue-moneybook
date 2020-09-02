type RecordItem = {
  tags: string[];
  notes: string;
  type: string;
  amount: number;
  createDat?: Date;
}
type Tag = {
  id: string;
  name: string;
}

type TagListModel = {
  data: Tag[];
  fetch: () => Tag[];
  create: (name: string) => 'success' | 'duplicated';
  update: (id: string, name: string) => 'success' | 'not found' | 'duplicated' | 'defeated';
  remove: (id: string) => boolean;
  save: () => void;
}

interface Window {
  tagList: Tag[];
  createTag: (arg: string) => void;
  removeTag: (id: string) => 'success' | 'defeated';
  updateTag: (id: string, name: string) => 'success' | 'not found' | 'duplicated' | 'defeated';
  saveTag: () => void;
  findTag: (id: string) => Tag | undefined;
}