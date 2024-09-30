import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatService } from '../services/chat/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  chatId!: string;
  messages$!: Observable<any[]>;
  newMessage: string = '';
  currentUserUid!: any;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    // Get the chatId from the route parameters
    this.chatId = this.route.snapshot.paramMap.get('chatId') as string;
    this.currentUserUid = this.chatService.getCurrentUserUid();
    
    // Fetch the messages for this chat
    this.messages$ = this.chatService.getMessages(this.chatId);
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const message = {
        senderId: this.currentUserUid,
        text: this.newMessage,
        timestamp: Date.now()
      };

      this.chatService.sendMessage(this.chatId, message);
      this.newMessage = '';  // Clear the input field after sending the message
    }
  }
}
