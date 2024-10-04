import { Injectable } from '@angular/core';
import {Auth,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,signInWithPopup,GoogleAuthProvider,onAuthStateChanged} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ChatService } from '../chat/chat.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedin: boolean = false;

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private auth: Auth, private router: Router, private chatService: ChatService) {
    onAuthStateChanged(this.auth, (user) => {
      this.isLoggedInSubject.next(!!user); 
    });
  }

  async signup(email: string, password: string,name: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('User signed up:', userCredential.user);
      const chatData = {
        users: [userCredential.user.uid], 
        createdAt: Date.now(),
        name: name
      };
      this.chatService.createChat(userCredential.user.uid, chatData); 
      this.router.navigate(['/users']); 
      this.isLoggedInSubject.next(true);
    } catch (error) {
      console.error('Signup error:', error);
    }
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('User logged in:', userCredential.user);
      this.router.navigate(['/users']); 
      this.isLoggedInSubject.next(true);
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  async signout() {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
      this.isLoggedInSubject.next(false);
      console.log('User signed out');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  async signupWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      console.log('User signed in with Google:', result.user);

      const chatData = {
        users: [result.user.uid], 
        createdAt: Date.now(),
      };
      this.chatService.createChat(result.user.uid, chatData); 
      this.router.navigate(['/users']); 
    } catch (error) {
      console.error('Google signup error:', error);
    }
  }
  
}