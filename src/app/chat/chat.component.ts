import { Component, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatService } from '../services/chat/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements AfterViewChecked {
  chatId!: string;
  messages$!: Observable<any[]>;
  newMessage: string = '';
  currentUserUid!: any;
  otherUserId!: string; // Add this to get the other user's ID
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.otherUserId = this.route.snapshot.paramMap.get('id') as string; // Get other user ID from route
    this.currentUserUid = this.chatService.getCurrentUserUid();

    if (this.currentUserUid && this.otherUserId) {
      // Generate a unique chatId based on both users' UIDs
      this.chatId = this.chatService.generateChatId(this.currentUserUid, this.otherUserId);

      // Fetch the messages for this chat
      this.messages$ = this.chatService.getMessages(this.chatId);
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.currentUserUid) {
      const message = {
        senderId: this.currentUserUid,
        text: this.newMessage,
        timestamp: Date.now(),
      };

      this.chatService.sendMessage(this.chatId, message);
      this.newMessage = ''; // Clear input after sending
      this.scrollToBottom();
    }
  }

  // Scroll to the bottom of the chat container
  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err: any) {
      console.error('Error while scrolling:', err);
    }
  }
}
