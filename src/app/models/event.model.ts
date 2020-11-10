import { firestore } from 'firebase';
import { ApiBde } from '../models/bde.model';
export interface MyEvent {
  name: string;
  description: string;
  date: firestore.Timestamp;
  activityNumber: number;
  activityHypedNumber: number;
  bdeId: string;
  id: string;
}

export interface ApiEvent {
  name: string;
  description: string;
  date: Date;
  id: number;
  isHyped: boolean;
  followersNumber: number;
  hypedNumber: number;
  bde: ApiBde;
}

export interface ApiHype {
  eventId: number;
  userId: string;
}
