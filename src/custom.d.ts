type RecordItem = {
  tags: Tag[];
  notes: string;
  type: string;
  amount: number;
  createdAt?: string;
}
type Tag = {
  id: string;
  name: string;
  tagicon: string;
}
type RootState = {
  record: RecordItem;
  recordList: RecordItem[];
  tagList: Tag[];
  currentTag?: Tag;
  isHave: boolean;
  changeShow: boolean;
  showBody: boolean;
}
type GetDay = {
  year: number;
  month: number;
  day: number;
}

