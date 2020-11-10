import { firestore } from 'firebase'

export interface NewBde {
  name: string
  description: string
  school: string
  nameLowercase: string
}

export interface Bde extends NewBde {
  id: string
}

export interface ApiBdeCreate {
  name: string;
  description: string;
  school: string;
  ownerId: string;
}

export interface ApiBde {
  name: string;
  description: string;
  school: string;
  id: number;
}

export interface IApiUserBde {
  bde: ApiBde;
  isFollowed: boolean;
}

export interface ApiMember {

  user: {
    id: string;
    name: string;
    email: string;
  };
  role: string;
}

export interface BdeList {

  list: Bde[]
  total_count: number
}

export interface BdeListItem extends Bde {
  followed: boolean
}

export interface newBdeMember {

  userRef: firestore.DocumentReference;
  bdeRef: firestore.DocumentReference;
  role: string;
  date: Date;
  userId: string;
  bdeId: string;
  fullName: string;
}
