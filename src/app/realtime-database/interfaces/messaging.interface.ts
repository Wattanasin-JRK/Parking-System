export interface IMessaging {
    id: any;
    email: string;
    licenseP: string;
    created: number;
    updated: number;

    /** optional ไว้แสดงหรือซ่อน Form แก้ไข */
    active?: boolean;
}