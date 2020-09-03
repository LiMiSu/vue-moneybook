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
type RootState = {
  recordList: RecordItem[];
  tagList: Tag[];
  currentTag?: Tag;
}

