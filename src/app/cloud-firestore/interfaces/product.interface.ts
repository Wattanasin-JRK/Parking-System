import firebase from 'firebase';

export interface IProduct 
{
    index: number;
    id: string;
    name: string;
    qty: number;
    unit: string;
    price: number;
    description: string;
    image?: any;
    created: firebase.firestore.Timestamp;
    updated: firebase.firestore.Timestamp;
}