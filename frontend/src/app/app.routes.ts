import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HostEventComponent } from './host-event/host-event.component';
import {JoinAGroupComponent} from "./join-a-group/join-a-group.component";

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'host-event', component: HostEventComponent },
  { path: 'join-a-group', component: JoinAGroupComponent }
];
