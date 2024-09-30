import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BodyComponent } from './body/body.component';

export const routes: Routes = [
     { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    component: BodyComponent ,
    children:[
     {path:'users',component:ChatListComponent},
     {path:'chat/:id',component:ChatComponent}
    ]
},

  { path: '**', redirectTo: '/login' },
];
 
