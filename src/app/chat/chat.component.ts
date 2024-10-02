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
  @ViewChild('chatContainer') chatContainer!: ElementRef;

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

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const message = {
        senderId: this.currentUserUid,
        text: this.newMessage,
        timestamp: Date.now(),
      };

      this.chatService.sendMessage(this.chatId, message); // Removed the .then() block
      this.newMessage = ''; // Clear input after sending
      this.scrollToBottom();
    }
  }

  // Scroll to the bottom of the chat container
  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err: any) { // Explicitly set error type to 'any'
      console.error('Error while scrolling:', err);
    }
  }
}
