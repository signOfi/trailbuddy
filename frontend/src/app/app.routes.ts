import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HostEventComponent } from './host-event/host-event.component';
import { JoinAGroupComponent } from "./join-a-group/join-a-group.component";
import { ManageGroupEventComponent } from './manage-group-event/manage-group-event.component';
import {MyEventsComponent} from "./my-events/my-events.component";

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'host-event', component: HostEventComponent },
  { path: 'join-a-group', component: JoinAGroupComponent },
  { path: 'manage-group', component: ManageGroupEventComponent },
  { path: 'my-events', component: MyEventsComponent },
];
