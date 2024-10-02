import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs } from 'firebase/firestore'; // Firestore
import { getDatabase, ref, set, get, onValue } from 'firebase/database'; // Realtime Database
import { Observable } from 'rxjs';
import { User, getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private db = getDatabase(); // Realtime Database instance
  private firestore = getFirestore(); // Firestore instance

  constructor() {}

  // Function to generate a unique room ID for two users
  private generateChatRoomId(userId1: string, userId2: string): string {
    return userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
  }

  // Create or get a chat room between two users
  async createOrGetChatRoom(userId1: string, userId2: string): Promise<string> {
    const chatId = this.generateChatRoomId(userId1, userId2);
    const chatRef = doc(this.firestore, `chats/${chatId}`);
    
    const chatDoc = await getDoc(chatRef);
    if (!chatDoc.exists()) {
      // Create the chat room metadata in Firestore if it doesn't exist
      await setDoc(chatRef, {
        users: [userId1, userId2],
        createdAt: Date.now(),
      });
    }

    return chatId;
  }

  // Send a message to a specific chat room in the Realtime Database
  sendMessage(chatId: string, message: { senderId: string; text: string; timestamp: number }) {
    const newMessageRef = ref(this.db, `chats/${chatId}/messages/${Date.now()}`);
    set(newMessageRef, message);
  }

  // Fetch messages for a specific chat room from Realtime Database
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
      getDoc(chatRef)
        .then((doc) => {
          if (doc.exists()) {
            observer.next(doc.data());
          } else {
            observer.next(null);
          }
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  // Fetch all chats from Firestore
  getAllChats(): Observable<any[]> {
    const chatsCollection = collection(this.firestore, 'chats');
    return new Observable((observer) => {
      getDocs(chatsCollection)
        .then((querySnapshot) => {
          const chats: any[] = [];
          querySnapshot.forEach((doc) => {
            chats.push({ id: doc.id, ...doc.data() });
          });
          observer.next(chats);
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  // Get the current user's UID
  getCurrentUserUid(): string | null {
    const user: User | null = getAuth().currentUser;
    return user ? user.uid : null;
  }
}
