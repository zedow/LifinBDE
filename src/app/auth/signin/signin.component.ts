import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signinForm: FormGroup;
  errorMessage: string;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router, private _snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }


  googleSignIn() {
    this.authService.signInWithGoogle().then(
      () => {
        this.router.navigate(['events']);
      },
      (error) => {
        console.log(error);
        this._snackbar.open("Une erreur est survenue, veuillez réessayer");
      }
    );
  }

  onSubmit() {

    const email = this.signinForm.get('email').value;
    const password = this.signinForm.get('password').value;

    this.authService.signInUser(email, password).then(
      () => {
        this.router.navigate(['']);
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }

}
