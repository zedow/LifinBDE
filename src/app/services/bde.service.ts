import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bde } from '../models/bde.model';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class BdeService {

  private bdeCollection: AngularFirestoreCollection<Bde>;
  bdeList: Observable<Bde[]>;

  constructor(private readonly fireStore: AngularFirestore) {
    this.bdeCollection = fireStore.collection<Bde>('BDE');
    this.bdeList = this.bdeCollection.valueChanges();
  }

  addBde(bde: Bde) {

    try {
      const id = this.fireStore.createId();
      const newBde = bde;
      newBde.Id = id;
      this.bdeCollection.add(newBde);
      console.log("Bde ajouté");
    }
    catch(error) {
      console.log("Erreur de l'ajout d'un BDE");
    }

  }

  removeBde(bde: Bde) {


  }

  getBdeList() {

    return this.bdeList;
  }
}
