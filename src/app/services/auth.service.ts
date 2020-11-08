import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { rejects } from 'assert';
import * as firebase from 'firebase';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';

// Models
import { CreateUserModel } from '../models/createUser.model';
import { User } from '../models/user.model';
import { UserRead } from '../models/userRead.model';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  currentUser : firebase.User = null;

  constructor(private fireAuth: AngularFireAuth, private fireStore: AngularFirestore) {

  }

  createNewUser(user: CreateUserModel) {

    return new Promise(
      (resolve,reject) => {
        this.fireAuth.createUserWithEmailAndPassword(user.email,user.password).then(
          (result) => {
            const newUser: User = {
              name: user.name,
              age: user.age,
              tel: user.tel
            }
            this.fireStore.collection('Users').doc(result.user.uid).set(newUser)
            this.signInUser(user.email,user.password)
            resolve();
          },
          (error) => {
            reject(error);
          }
        )
      }
    );
  }

  signInUser(email: string, password: string) {

    return new Promise(
      (resolve,reject) => {
        this.fireAuth.signInWithEmailAndPassword(email, password).then(
          (result) => {
            this.currentUser = result.user;
            resolve();
          },
          (error) => {
            reject(error);
          }
        )
      }
    )
  }

  signInWithGoogle()
  {
    return new Promise(
      (resolve,reject) => {
        this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
          (result) => {
            const user = result.user;
            const docRef = this.fireStore.collection('Users').doc(user.uid);
            docRef.get().toPromise().then(
              (doc) => {
                if(!doc.exists)
                {
                  docRef.set({
                    name: user.displayName,
                    tel: user.phoneNumber,
                    age: null
                  })
                }
                resolve(result);
              }
            );
          }
        );
      }
    );

  }

  signOutUser() {

    return new Promise(
      (resolve,reject) => {
        this.fireAuth.signOut().then(
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        )
      }
    )

  }

  get currentUserInfo()
  {
    return new Promise(
      (resolve,reject) => {
        this.fireStore.collection('Users').doc(this.currentUser.uid).valueChanges().toPromise().then(
          (result) => {
            resolve(result);
          },
          (error) => {
            reject(error);
          }
        );

      }
    )
  }

  getCurrentUserRef() : firebase.firestore.DocumentReference {
    return this.fireStore.collection('Users').doc(this.currentUser.uid).ref
  }

  getCurrentUser() : Observable<firebase.User> {
    return this.fireAuth.authState;
  }
}
