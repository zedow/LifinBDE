import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { map } from 'rxjs/operators';
import { SignupComponent } from './auth/signup/signup.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { SigninComponent } from './auth/signin/signin.component';
import { MainComponent } from './main/main.component';
import { BdeListComponent } from './bde-list/bde-list.component';
import { BdeFormComponent } from './bde-list/bde-form/bde-form.component';
import { SingleBdeComponent } from './bde-list/single-bde/single-bde.component';
import { ProfileComponent } from './auth/profile/profile.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const redirectToProfile = () => map(
  user => user ? ['profile', (user as any).uid] : true
);

const onlyAllowSelf = next => map(
  // tslint:disable-next-line: triple-equals
  user => (!!user && next.params.id == (user as any).uid) || ['']
);

const routes: Routes = [
  {path: '', component: MainComponent,
    children: [
      {path: 'events', component: BdeListComponent},
      {path: 'bde', component: BdeListComponent},
      {path: 'bde/{id}', component: SingleBdeComponent},
      {path: 'bde/new', component: BdeFormComponent},
      {path: '', redirectTo: '/events', pathMatch: 'full'},
    ]
  },
  {path: 'signup', component: SignupComponent},
  {path: 'login', component: SigninComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectToProfile}},
  {path: 'profile', component: ProfileComponent, data: {authGuardPipe: onlyAllowSelf}},
  {path: '**', redirectTo: '/bde', pathMatch:'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
