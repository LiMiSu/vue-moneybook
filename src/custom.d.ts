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