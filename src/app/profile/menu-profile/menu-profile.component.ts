import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu-profile',
  templateUrl: './menu-profile.component.html',
  styleUrls: ['./menu-profile.component.scss']
})

export class MenuProfileComponent implements OnInit {

  user: firebase.User;

  constructor(private authService: AuthService, private fireAuth: AngularFireAuth) { }

  ngOnInit(): void {

    this.fireAuth.authState.subscribe(
      (value) => {
        this.user = value;
      }
    );
  }
}
