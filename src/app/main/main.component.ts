import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  user: firebase.User;

  constructor(private authService: AuthService, private router: Router, private fireAuth: AngularFireAuth) { }

  ngOnInit(): void {
    this.fireAuth.signOut();
    this.fireAuth.authState.subscribe(
      (value) => {
        this.user = value;
        this.authService.currentUser = value;
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
