import { Component, QueryList, ViewChildren } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';

import { InputFieldComponent } from './components/input-field/input-field.component';
import { MessageCardComponent } from './components/message-card/message-card.component';
import { MindmapFieldComponent } from './components/mindmap-field/mindmap-field.component';
import { ApikeyDialogComponent } from './components/apikey-dialog/apikey-dialog.component';

import { ChatSession, Content, GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai'


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    InputFieldComponent,
    MessageCardComponent,
    MindmapFieldComponent,
    ApikeyDialogComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(
    public dialog: MatDialog
  ) {
    this.api_key = localStorage.getItem('API_KEY') || '';
    if (!this.api_key) {
      this.openDialog();
    } else {
      this.initGenerativeAI();
    }
  }

  api_key: string;
  title = 'Mind Mentor';
  generativeAI!: GoogleGenerativeAI;
  model!: GenerativeModel;
  chatSession!: ChatSession;
  history: Content[] = [];
  markdown: string = '';

  @ViewChildren('messageCard') messageCards!: QueryList<MessageCardComponent>;

  initGenerativeAI() {
    this.generativeAI = new GoogleGenerativeAI(this.api_key);

    this.model = this.generativeAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      systemInstruction: 'あなたは良きメンターあるいはコーチです。13才の私との対話を通して私の持つ概念を精緻化するように質問を繰り返してください。また話題が広がりすぎないようにし、中心となる概念を中心に質問を繰り返してください。私との対話の際には返答にその時点での概念地図として概念の階層構造を含めてください。概念の階層構造は、Markdown記法で記述し、コードブロックとして出力してください。',
    });

    this.initChatSession();
  }

  initChatSession() {
    this.chatSession = this.model.startChat();

    this.history = [];
  }

  onSendMessage(event: string): void {
    this.sendMessage(event);
  }

  async sendMessage(prompt: string): Promise<void> {
    this.history.push({
      role: 'user',
      parts: [{ text: prompt }],
    });

    window.setTimeout(() => {
      this.messageCards.last.scrollTo();
    });

    const result = await this.chatSession.sendMessage(prompt);

    this.history.push({
      role: 'model',
      parts: [{ text: result.response.text() }],
    });

    window.setTimeout(() => {
      this.messageCards.last.scrollTo();
    });

    const codeBlocks = this.extractCodeBlocks(result.response.text());
    const code = [];
    for (const codeBlock of codeBlocks) {
      code.push(codeBlock.code);
    }

    if (code.length > 0) {
      this.markdown = code.join('\n\n');
    }
  }

  extractCodeBlocks(markdownString: string): { language: string, code: string }[] {
    const codeBlockRegex = /`([a-z]*)\n([\s\S]*?)\n`/g;
    const codeBlocks = [];
    let match;

    while ((match = codeBlockRegex.exec(markdownString)) !== null) {
      const language = match[1].trim();
      const code = match[2].trim();
      codeBlocks.push({ language, code });
    }

    return codeBlocks;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ApikeyDialogComponent, {
      data: { key: this.api_key },
    });

    dialogRef.afterClosed().subscribe(key => {
      if (key) {
        this.api_key = key;
        localStorage.setItem('API_KEY', key);
        this.initGenerativeAI();
      }
    });
  }
}
