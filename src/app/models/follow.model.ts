import { firestore } from 'firebase';

export interface Follow {

  bdeRef: firestore.DocumentReference;
}

export interface IApiFollower {

  userId: string;
  bdeId: number;
}

export interface IApiCreateFollower {
  userId: string;
}
