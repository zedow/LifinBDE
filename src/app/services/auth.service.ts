import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { rejects } from 'assert';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';

// Models
import { CreateUserModel } from '../models/createUser.model';
import { User } from '../models/user.model';
import { UserRead } from '../models/userRead.model';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  currentUser : firebase.User = null;
  private userUrl = 'https://lifin.qtmsheep.com/api/users';

  constructor(private fireAuth: AngularFireAuth, private fireStore: AngularFirestore, private http : HttpClient) {

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
              console.log(`${this.userUrl}/${result.user.uid}`);

              this.http.get(`${this.userUrl}/${result.user.uid}`).toPromise().then(
                (getResult) => {
                  console.log(getResult);
                  this.currentUser = getResult as firebase.User;
                  resolve();
                  //this.http.post(`${this.userUrl}`,result);
                },
                (error) => {
                    console.log(error);
                    const newUser = {
                      id: result.user.uid,
                      name: result.user.displayName,
                      email: result.user.email
                    };
                    this.http.post(`${this.userUrl}`,newUser).toPromise().then(
                      () => {
                        resolve();
                      },
                      (error) => {
                        console.log(error);
                        reject();
                      }
                    );
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

  getCurrentUser() : Observable<firebase.User> {
    return this.fireAuth.authState;
  }
}
