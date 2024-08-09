import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Content } from '@google/generative-ai';
import { marked } from 'marked';


@Component({
  selector: 'app-message-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './message-card.component.html',
  styleUrl: './message-card.component.css'
})
export class MessageCardComponent {
  constructor() { }

  role!: string;
  text: string = '';
  html: string = '';

  @ViewChild('card') card!: ElementRef<HTMLDivElement>;

  @Input() set content(content: Content) {
    this.role = content.role;
    for (const part of content.parts) {
      this.text += part.text;
    }

    this.parseMarkdown(this.text);
  }

  async parseMarkdown(markdown: string): Promise<void> {
    this.html = await marked.parse(markdown);
  }

  scrollTo(): void {
    this.card.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
