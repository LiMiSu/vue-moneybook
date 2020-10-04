type RecordItem = {
  tag: Tag;
  id: string;
  notes: string;
  type: string;
  amount: number;
  createdAt: string;
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
  dayRecordList: DayResult[];
  monthRecordList: MonthResult[];
  yearRecordList: YearResult[];
  currentTag?: Tag | string;
  currentRecord: RecordItem;
  isHave: boolean;
  showBody: boolean;
  showAdd: boolean;
  showtype: boolean;
  key: number;
  chooseYear: string;
  chooseMonth: string;
  interval: string;
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
type DayResult = {
  string: string;
  show: boolean;
  title: string;
  total?: number;
  items: RecordItem[];
}
type MonthResult = {
  string: string;
  show: boolean;
  title: string;
  total?: number;
  items: DayResult[];
}
type YearResult = {
  string: string;
  show: boolean;
  title: string;
  total?: number;
  items: MonthResult[];
}
type RecordByTag = {
  id: string;
  title: string;
  icon: string;
  name: string;
  num: number;
  recordList: RecordSameTagList[];
}
type RecordSameTagList = {
  id: string;
  date: string;
  name: string;
  num: number;
}
type RecordSameTagListResult = {
  title: string;
  total: number;
  icon: string;
  name: string;
  recordList: RecordSameTagList[];
}