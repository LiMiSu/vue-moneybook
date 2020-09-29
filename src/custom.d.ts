type RecordItem = {
  tag: Tag;
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
  dayRecordList: DayResult[];
  monthRecordList: MonthResult[];
  yearRecordList: YearResult[];
  currentTag?: Tag | string;
  isHave: boolean;
  showBody: boolean;
  showAdd: boolean;
  showtype: boolean;
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
  show: boolean;
  title: string;
  total?: number;
  items: RecordItem[];
}
type MonthResult = {
  show: boolean;
  title: string;
  total?: number;
  items: DayResult[];
}
type YearResult = {
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