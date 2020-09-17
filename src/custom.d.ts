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
  dayRecordList: Result[];
  monthRecordList: Resultwrapper[];
  yearRecordList: Resultwrapper[];
  currentTag?: Tag | string;
  isHave: boolean;
  showBody: boolean;
  showAdd: boolean;
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
  title: any;
  total?: number;
  items: RecordItem[];
}
type Resultwrapper={
  title: any;
  total?: number;
  items: Result[];
}