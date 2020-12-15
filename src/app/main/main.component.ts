import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BdeService } from '../services/bde.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  user: firebase.default.User;
  ownerList: any[];

  constructor(private authService: AuthService, private router: Router, private fireAuth: AngularFireAuth, private bdeService: BdeService) { }

  ngOnInit(): void {
    this.fireAuth.currentUser.then(
      (user) => {
        this.user = user;
        this.bdeService.GetOwnedBde(user.uid).subscribe(
          (data) => {
            this.ownerList = data;
          }
        );
        console.log(user);
      }
    );
  }

  signOut() {
    this.authService.signOutUser().then(
      () => {
        this.router.navigate(['login']);
        console.log('Deconnecté !');
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
