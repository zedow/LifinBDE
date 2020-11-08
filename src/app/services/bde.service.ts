import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiBde, ApiBdeCreate, ApiMember, Bde, BdeListItem, NewBde, newBdeMember } from '../models/bde.model';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore'
import { AuthService } from './auth.service';
import { Follow } from '../models/follow.model';
import { last, map } from 'rxjs/operators';
import { firestore } from 'firebase';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Member } from '../models/user.model';
import { MemberListComponent } from '../bde-list/single-bde/member-list/member-list.component';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BdeService {

  private bdeCollection: AngularFirestoreCollection<Bde>;
  bdeList: Observable<Bde[]>;

  private bdeUrl = 'https://localhost:44392/api/bdes';

  constructor(private readonly fireStore: AngularFirestore, private authService: AuthService,
    private http: HttpClient) {
    this.bdeCollection = fireStore.collection<Bde>('BDE');
    this.bdeList = this.bdeCollection.valueChanges({idField: 'id'});
  }

  AddBde(bde: ApiBdeCreate): Observable<ApiBde> {

    return this.http.post<ApiBde>(this.bdeUrl,bde);
  }

  addBdeMember(userRef: firestore.DocumentReference, bdeRef: firestore.DocumentReference, role: string): Promise<void> {
    return new Promise(
      (resolve,reject) => {
        userRef.get().then(
          (user) => {
            const userData = user.data();
            const newMember: newBdeMember = {
              userRef: userRef,
              bdeRef:bdeRef,
              date: new Date(),
              role: role,
              userId: userRef.id,
              bdeId: bdeRef.id,
              fullName: userData.name + userData.surname
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
          },
          (error) => {
            reject(error);
          }
        )
      }
    )
  }

  isFollowedBy(bdeId: string, userId: string)
  {
    console.log(userId + ' fournit dans le followedBy');

    return this.fireStore.collection('Users').doc(userId).collection('follows').doc(bdeId).ref;
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

  getBdeList(filterValue: string): Observable<ApiBde[]> {

    var urlToQuery;
    if(filterValue != null)
    {
      urlToQuery = `${this.bdeUrl}?filter=${filterValue}`;
    }
    else {
      urlToQuery = this.bdeUrl;
    }
    return this.http.get<ApiBde[]>(urlToQuery);
  }

  getPaginatedBdeList(pageIndex: number,firstDocId: string, lastDocId: string, oldPageIndex: number, filterValue: string, limit: number) : Observable<Bde[]> {

    return this.fireStore.collection<Bde>('BDE',ref =>
    {
      console.log("Lancement de la requête paginée");
      console.log(filterValue + " est la valeur du filtre dans le service BDE");

      let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      query = query.orderBy("nameLowercase");
      if(filterValue != null && filterValue != "")
      {
        console.log("Filtre sur le nom des BDE lancé avec comme recherche : " + filterValue);
        query = query.startAt(filterValue).endAt(filterValue + + "\uf8ff")
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

  getBde(id: string): Observable<ApiBde> {

    return this.http.get<ApiBde>(`${this.bdeUrl}/${id}`);
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
    return this.fireStore.collection<Member>('BDE_members', ref => ref.where('bdeId','==',bdeId)).valueChanges({idField: 'id'});
  }

  GetBdeMembers(bdeId: number) : Observable<ApiMember[]> {
    return this.http.get<ApiMember[]>(`${this.bdeUrl}/${bdeId}/members`);
  }
}
