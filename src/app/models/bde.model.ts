import { firestore } from 'firebase'

export interface NewBde {
  name: string
  description: string
  school: string
}

export interface Bde extends NewBde {
  id: string
}

export interface BdeList {

  list: Bde[]
  total_count: number
}

export interface BdeListItem extends Bde {
  followed: boolean
}

export interface newBdeMember {

  userRef: firestore.DocumentReference
  bdeRef: firestore.DocumentReference
  role: string
  date: Date
}
