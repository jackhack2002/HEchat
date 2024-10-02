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
  currentUserUid!: string | null;
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    // Fetch the recipient's UID from route parameters
    const recipientId = this.route.snapshot.paramMap.get('recipientId') as string;

    // Get current user UID
    this.currentUserUid = this.chatService.getCurrentUserUid();

    if (this.currentUserUid && recipientId) {
      // Generate a unique chatId based on the two users' UIDs
      this.chatId = this.chatService.generateChatId(this.currentUserUid, recipientId);

      // Fetch the messages for this chat
      this.messages$ = this.chatService.getMessages(this.chatId);
    } else {
      console.error('User or recipient UID is missing');
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (this.currentUserUid && this.newMessage.trim()) {
      const message = {
        senderId: this.currentUserUid,
        text: this.newMessage,
        timestamp: Date.now(),
      };

      // Send the message using the ChatService
      this.chatService.sendMessage(this.chatId, message)
        .then(() => {
          this.newMessage = ''; // Clear input after successful message send
          this.scrollToBottom(); // Scroll to the bottom of the chat after sending
        })
        .catch((error: any) => {
          console.error('Error sending message:', error);
        });
    } else {
      console.error('Cannot send message: User not logged in or message is empty');
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
