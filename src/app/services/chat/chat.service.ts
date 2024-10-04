import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs } from 'firebase/firestore';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { Observable } from 'rxjs';
import { User, getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  
  private db = getDatabase();
  private firestore = getFirestore();

  constructor() {}

  // Generate a unique chatId based on two user UIDs
  generateChatId(currentUserUid: string, otherUserId: string): string {
    return [currentUserUid, otherUserId].sort().join('_');
  }

  sendMessage(chatId: string, message: { senderId: string; text: string; timestamp: number }) {
    const messagesRef = ref(this.db, `chats/${chatId}/messages`);
    const newMessageRef = ref(this.db, `chats/${chatId}/messages/${Date.now()}`);
    set(newMessageRef, message);
  }

  // Fetch messages for a specific chat from Realtime Database
  getMessages(chatId: string): Observable<any[]> {
    const messagesRef = ref(this.db, `chats/${chatId}/messages`);
    return new Observable((observer) => {
      onValue(messagesRef, (snapshot) => {
        const messages: any[] = [];
        snapshot.forEach((childSnapshot) => {
          messages.push(childSnapshot.val());
        });
        observer.next(messages);
      });
    });
  }

  // Store chat metadata in Firestore
  createChat(chatId: string, chatData: { users: string[]; createdAt: number }) {
    const chatRef = doc(this.firestore, `chats/${chatId}`);
    return setDoc(chatRef, chatData);
  }

  // Fetch chat metadata from Firestore
  getChatMetadata(chatId: string): Observable<any> {
    const chatRef = doc(this.firestore, `chats/${chatId}`);
    return new Observable((observer) => {
      getDoc(chatRef).then((doc) => {
        if (doc.exists()) {
          observer.next(doc.data());
        } else {
          observer.next(null);
        }
      }).catch((error) => {
        observer.error(error);
      });
    });
  }

  // Fetch all chats from Firestore
  getAllChats(): Observable<any[]> {
    const chatsCollection = collection(this.firestore, 'chats');
    return new Observable((observer) => {
      getDocs(chatsCollection).then((querySnapshot) => {
        const chats: any[] = [];
        querySnapshot.forEach((doc) => {
          chats.push({ id: doc.id, ...doc.data() });
        });
        observer.next(chats);
      }).catch((error) => {
        observer.error(error);
      });
    });
  }

  getCurrentUserUid(): string | null {
    const user: User | null = getAuth().currentUser;
    return user ? user.uid : null;
  }
}
