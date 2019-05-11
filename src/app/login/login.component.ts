import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserInfo } from 'firebase';

@Component({
  selector: 'lm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Input() user: UserInfo;
  @Input() users: UserInfo[];
  @Output() emailLoginRequested = new EventEmitter<string>();

  selectedMail: string;
}
