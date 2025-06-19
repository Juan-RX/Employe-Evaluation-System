import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'add-button',
  imports: [],
  templateUrl: './addButton.component.html',
  styleUrl: './addButton.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddButtonComponent {
  @Output() onClick = new EventEmitter<void>();
}
