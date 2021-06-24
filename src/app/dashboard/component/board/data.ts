export interface CarStats {
  id?: any;
  created: number;
  num : number;
  Tnum : number;
  status : string;

  /** optional ไว้แสดงหรือซ่อน Form แก้ไข */
  active?: boolean;
}