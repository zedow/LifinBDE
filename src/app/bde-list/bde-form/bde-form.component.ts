import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { firestore } from 'firebase';
import { NewBde } from 'src/app/models/bde.model';
import { AuthService } from 'src/app/services/auth.service';
import { BdeService } from 'src/app/services/bde.service';

@Component({
  selector: 'app-bde-form',
  templateUrl: './bde-form.component.html',
  styleUrls: ['./bde-form.component.scss']
})

export class BdeFormComponent implements OnInit {

  newBde: FormGroup;
  isAdding = false;

  constructor(private formBuilder: FormBuilder, private bdeService: BdeService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.newBde = this.formBuilder.group({
      name: ['', [Validators.required]],
      school: ['', [Validators.required]],
      description: ['',Validators.required],
    });
  }

  onSubmit() {

    this.isAdding = true;

    const name = this.newBde.get('name').value;
    const school = this.newBde.get('school').value;
    const description = this.newBde.get('description').value;

    const bde: NewBde = {
      name: name,
      school: school,
      description: description,
    }

    const role = "Admin";

    this.bdeService.addBde(bde).then(
      (createdBde) => {
        this.bdeService.addBdeMember(this.authService.getCurrentUserRef(), createdBde, role).then(
          () => {
            console.log('Bde créé !');
            this.isAdding = false;
            this.router.navigate(['bde/' + createdBde.id])
          },
          (error) => {
            console.log(error);
          }
        );
      }
    )
  }

}
