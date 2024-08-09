import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.css'
})
export class InputFieldComponent {
  constructor() {
    this.rows = 1;
    this.text = '';
  }

  rows: number;
  text: string;

  @Output() sendMessage = new EventEmitter<string>();

  onInput(event: Event): void {
    const lines = (event.target as HTMLTextAreaElement).value.split('\n');
    this.rows = lines.length;
  }

  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
        if (!event.altKey
          && !event.ctrlKey
          && !event.metaKey
          && !event.shiftKey) {
          event.preventDefault();

          if (this.text.length > 0) {
            this.sendMessage.emit(this.text);

            this.text = '';
          }
        }
        break;

      default:
        break;
    }
  }

  onClickSend(event: MouseEvent): void {
    if (this.text.length > 0) {
      this.sendMessage.emit(this.text);

      this.text = '';
    }
  }
}
