import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { map } from 'rxjs/operators';
import { SignupComponent } from './auth/signup/signup.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo, redirectLoggedInTo,canActivate   } from '@angular/fire/auth-guard';
import { SigninComponent } from './auth/signin/signin.component';
import { MainComponent } from './main/main.component';
import { BdeListComponent } from './bde-list/bde-list.component';
import { BdeFormComponent } from './bde-list/bde-form/bde-form.component';
import { SingleBdeComponent } from './bde-list/single-bde/single-bde.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { EventsListComponent } from './events-list/events-list/events-list.component';
import { EventFormComponent } from './events-list/event-form/event-form.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const redirectToProfile = () => map(
  user => user ? ['profile', (user as any).uid] : true
);

const redirectLoggedInToItems = () => redirectLoggedInTo(['']);

const onlyAllowSelf = next => map(
  // tslint:disable-next-line: triple-equals
  user => (!!user && next.params.id == (user as any).uid) || ['']
);

const routes: Routes = [
  {path: '', component: MainComponent,
    children: [
      {path: 'events', component: EventsListComponent},
      {path: 'events/new', component: EventFormComponent},
      {path: 'bde', component: BdeListComponent},
      {path: 'bde/new', component: BdeFormComponent},
      {path: 'bde/:id', component: SingleBdeComponent},
      {path: '', redirectTo: '/events', pathMatch: 'full'},
    ],
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {path: 'signup', component: SignupComponent},
  {path: 'login', component: SigninComponent,...canActivate(redirectLoggedInToItems)},
  {path: 'profile', component: ProfileComponent, data: {authGuardPipe: onlyAllowSelf}},
  {path: '**', redirectTo: '/bde', pathMatch:'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
