import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiBde, ApiBdeCreate, ApiMember, Bde, BdeListItem, IApiUserBde, NewBde, newBdeMember } from '../models/bde.model';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore'
import { AuthService } from './auth.service';
import { Follow, IApiCreateFollower, IApiFollower } from '../models/follow.model';
import { last, map } from 'rxjs/operators';
import { firestore } from 'firebase';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Member } from '../models/user.model';
import { MemberListComponent } from '../bde-list/single-bde/member-list/member-list.component';
import { HttpClient } from '@angular/common/http';
import { ICreateMember } from '../models/member.mode';

@Injectable({
  providedIn: 'root'
})
export class BdeService {

  private bdeCollection: AngularFirestoreCollection<Bde>;
  bdeList: Observable<Bde[]>;

  private bdeUrl = 'https://51.159.38.160/api/bdes';
  private userUrl = 'https://51.159.38.160/api/users';

  constructor(private readonly fireStore: AngularFirestore, private authService: AuthService,
    private http: HttpClient) {
    this.bdeCollection = fireStore.collection<Bde>('BDE');
    this.bdeList = this.bdeCollection.valueChanges({idField: 'id'});
  }

  AddBde(bde: ApiBdeCreate): Observable<ApiBde> {

    return this.http.post<ApiBde>(this.bdeUrl,bde);
  }

  AddBdeMember(userId: string,bdeId: number,role: string): Observable<ICreateMember> {
    const member : ICreateMember = {
      userId: userId,
      role: role
    };
    return this.http.post<ICreateMember>(`${this.bdeUrl}/${bdeId}/members`,member);
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

  GetBdeList(filterValue: string): Observable<ApiBde[]> {

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

  GetUserBdeList(filterValue: string, userId: string): Observable<IApiUserBde[]> {

    var urlToQuery;
    if(filterValue != null)
    {
      urlToQuery = `${this.userUrl}/${userId}/bde?filter=${filterValue}`;
    }
    else {
      urlToQuery = `${this.userUrl}/${userId}/bde`;
    }
    console.log(urlToQuery);

    return this.http.get<IApiUserBde[]>(urlToQuery);
  }

  GetBde(id: string): Observable<ApiBde> {

    return this.http.get<ApiBde>(`${this.bdeUrl}/${id}`);
  }

  FollowBde(bdeId: number): Observable<IApiFollower> {
    const follow: IApiCreateFollower = {
      userId: 'OqBbyIQGLDU4nvoniFzLLKC3IFp2'
    }
    return this.http.post<IApiFollower>(`${this.bdeUrl}/${bdeId}/follow`,follow);
  }

  GetBdeMembers(bdeId: number) : Observable<ApiMember[]> {
    return this.http.get<ApiMember[]>(`${this.bdeUrl}/${bdeId}/members`);
  }
}
