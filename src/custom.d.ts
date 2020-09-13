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
  type: string;
}
type RootState = {
  record: RecordItem;
  recordList: RecordItem[];
  tagList: Tag[];
  monthRecordList: Result[];
  currentTag?: Tag;
  isHave: boolean;
  showBody: boolean;
}
type GetDay = {
  year: number;
  month: number;
  day: number;
}
type DataSourceItem = {
  text: string;
  value: string;
}
type Result = {
  title: string;
  total?: number;
  items: RecordItem[];
}