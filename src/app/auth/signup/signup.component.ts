import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

// Models
import { CreateUserModel } from '../../models/createUser.model';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  errorMessage: string;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      tel: ['',Validators.required],
      lastname: ['', [Validators.required]],
      age: ['', [Validators.required]]
    });
  }

  onSubmit() {

    const email = this.signupForm.get('email').value;
    const password = this.signupForm.get('password').value;
    const lastname = this.signupForm.get('lastname').value;
    const age = this.signupForm.get('age').value;
    const tel = this.signupForm.get('tel').value;

    const user: CreateUserModel = {
      email: email,
      password: password,
      name: lastname,
      age: age,
      tel: tel
    }

    this.authService.createNewUser(user).then(
      () => {
        this.router.navigate(['']);
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }

}
