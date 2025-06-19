import { UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [UpperCasePipe],
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent  {
  @Input() title = '';
}
