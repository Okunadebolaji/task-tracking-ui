import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.css']
})
export class TaskModalComponent {

  @Input() title = '';
  @Input() tasks: any[] = [];
  @Input() loading = false;

  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
