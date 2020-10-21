import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireAuth: AngularFireAuth) { }

  createNewUser(email: string, password: string) {

    return new Promise(
      (resolve,reject) => {
        this.fireAuth.createUserWithEmailAndPassword(email,password).then(
          () => {
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

  signOutUser() {

    this.fireAuth.signOut();
  }
}
