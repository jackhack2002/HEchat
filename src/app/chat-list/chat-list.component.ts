import { CommonModule,NgFor,NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, Subscribable } from 'rxjs';
import { ChatService } from '../services/chat/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule,NgFor,NgForOf],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent {
  chats: any[] = [];  

  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit(): void {
    this.getChatList();
  }

  getChatList(): void {
    this.chatService.getAllChats().subscribe((chats) => {
      this.chats = chats;
    });
  }

  openChat(chatId: string): void {
    this.router.navigate(['/chat', chatId]);
  }
}