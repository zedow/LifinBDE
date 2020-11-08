import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { firestore } from 'firebase';
import { ApiBde, ApiBdeCreate, NewBde } from 'src/app/models/bde.model';
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

  constructor(private formBuilder: FormBuilder, private bdeService: BdeService, private router: Router, private authService: AuthService,
    private _snackBar: MatSnackBar) { }

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

    const bde: ApiBdeCreate = {
      name: name,
      school: school,
      description: description,
      ownerId: this.authService.currentUser.uid
    };

    this.bdeService.AddBde(bde).subscribe(
      (data) => {
        const newBde: ApiBde = data;
        this._snackBar.open("Bde ajouté avec succès");
        this.newBde.reset();
      },
      (error) => {
        console.log(error);
        this._snackBar.open("Une erreur est survenue");
      }
    );
  }

}
