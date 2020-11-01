import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Bde, BdeListItem, NewBde, newBdeMember } from '../models/bde.model';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore'
import { AuthService } from './auth.service';
import { Follow } from '../models/follow.model';
import { last, map } from 'rxjs/operators';
import { firestore } from 'firebase';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Member } from '../models/user.model';
import { MemberListComponent } from '../bde-list/single-bde/member-list/member-list.component';

@Injectable({
  providedIn: 'root'
})
export class BdeService {

  private bdeCollection: AngularFirestoreCollection<Bde>;
  bdeList: Observable<Bde[]>;

  constructor(private readonly fireStore: AngularFirestore, private authService: AuthService) {
    this.bdeCollection = fireStore.collection<Bde>('BDE');
    this.bdeList = this.bdeCollection.valueChanges({idField: 'id'});
  }

  addBde(bde: NewBde): Promise<firestore.DocumentReference> {
    return new Promise(
      (resolve, reject) => {
        const newBde: Bde = {id: this.fireStore.createId(),...bde};
        this.fireStore.collection<Bde>('BDE').add(newBde).then(
          (result) => {
            console.log("Bde ajouté");
            resolve(result);
          },
          (error) => {
            console.log(error);
            reject(error);
          }
        );

      }
    );
  }

  addBdeMember(userRef: firestore.DocumentReference, bdeRef: firestore.DocumentReference, role: string): Promise<void> {
    return new Promise(
      (resolve,reject) => {
        const newMember: newBdeMember = {
          userRef: userRef,
          bdeRef:bdeRef,
          date: new Date(),
          role: role
        }
        this.fireStore.collection<newBdeMember>('BDE_members').add(newMember).then(
          () => {
            resolve();
          },
          (error) => {
            console.log(error);
            reject(error);
          }
        )
      }
    )
  }

  isFollowedBy(bdeId: string, userId: string) : Promise<boolean>
  {
    return new Promise(
      (resolve,reject) => {
        this.fireStore.collection('Users').doc(userId).collection('follows').doc(bdeId).get().toPromise().then(
          (result) =>  {
            if(result.exists) {
              resolve(true);
            }
            else {
              reject(false);
            }
          }
        )
      }
    )
  }

  removeBde(idBde: string): Promise<void> {

    return new Promise(
      (resolve,reject) => {
        this.bdeCollection.doc(idBde).delete().then(
          () => {
            console.log("Bde avec l'id : " + idBde + " a été supprimé");
            resolve();
          },
          (error) => {
            reject(error);
          }
        )
      }
    )

  }

  getBdeList() {

    return this.bdeList;
  }

  getPaginatedBdeList(pageIndex: number,firstDocId: string, lastDocId: string, oldPageIndex: number) : Observable<Bde[]> {

    return this.fireStore.collection<Bde>('BDE',ref =>
    {
      console.log("Lancement de la requête paginée");

      let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if(firstDocId && lastDocId)
      {
        console.log("Pagination lancée avec " + pageIndex + " et l'ancien index était : " + oldPageIndex);
        if(pageIndex > oldPageIndex)
        {
          console.log("Pagination en avant : la limite est située sur l'id : " + lastDocId);
          query = query.orderBy("id").startAfter(lastDocId).limit(2);
          console.log(query);
        }
        else {
          query = query.orderBy("id").endBefore(firstDocId).limit(2);
        }
      }
      else {
        query = query.orderBy("id").limit(2);
      }
      return query;
    }).valueChanges({idField: 'id'});
  }

  getTotalBdeCount() : Observable<number>
  {
    return this.bdeList.pipe(
      map(data => {
        return data.length;
      })
    )
  }

  getBde(id: string): Observable<firestore.DocumentSnapshot> {
    return this.bdeCollection.doc(id).get();
  }

  followBde(bdeId: string) {

    return new Promise(
      (resolve,reject) => {
        const follow: Follow = {
          bdeRef: this.bdeCollection.doc(bdeId).ref
        }
        this.fireStore.collection('Users').doc(this.authService.currentUser.uid).collection('follows').doc(bdeId).set(follow).then(
          (result) => {
            resolve(result)
          }
        ).catch(
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  getBdeMembersList(bdeId: string): Observable<Member[]> {

    let members: Member[] = [];
    var count: number = 1;
    // récupère le document lié au ID bde fournit
    console.log(bdeId + " est l'ID du bde recherché");

    this.bdeCollection.doc(bdeId).get().toPromise().then(
      (bde) => {
        // Si il existe
        if(bde.exists)
        {
          console.log("Le bde existe, lancement de la procédure");
          // Récupère la collection des BDE membre où la Ref BDE est égale à la ref du BDE en paramètre

          this.fireStore.collection('BDE_members',ref => ref.where('bdeId', '==', bdeId)).get().toPromise().then(
            (querySnapshot) => {
              console.log(querySnapshot.size + ' est la taille du tableau des membres');

              // Pour chaque résultat les données sont récupéré dans une variable
              querySnapshot.forEach((doc) => {
                console.log('Boucle sur la collection des members');
                const data = doc.data();
                const member: Member = new Member();
                member.position = count;
                member.role = data.role;
                // Agrégation du compteur pour afficher le numéro du membre dans un tableau
                count++;
                console.log('Membre object created');

                const userRef = data.userRef;
                console.log(userRef);
                // Récupération de l'utilsateur pour avoir son nom
                this.fireStore.doc(userRef).get().toPromise().then(
                  (user) => {
                    console.log('User found');

                    member.name = user.data().name;
                    member.id = user.id;
                    members.push(member);
                    console.log('member pushed');

                  }
                )
              })
            }
          )
        }
        else {
          console.log('BDE inexistant');
        }
      }
    )
    return of(members);
  }
}
