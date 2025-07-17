import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-voice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './voice.component.html',
  styleUrls: ['./voice.component.scss']
})
export class VoiceComponent {
  showUploadModal = false;
  showUploadCard = false;
  isClosing = false;

  openModal() {
    console.log('openModal called');
    this.showUploadModal = true;
  }

  closeModal() {
    this.showUploadModal = false;
  }

  toggleUploadCard() {
    if (this.showUploadCard && !this.isClosing) {
      this.isClosing = true;
      setTimeout(() => {
        this.showUploadCard = false;
        this.isClosing = false;
      }, 350); // match the animation duration
    } else if (!this.showUploadCard) {
      this.showUploadCard = true;
    }
  }
} 