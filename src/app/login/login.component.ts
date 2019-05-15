import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from '../players/player';

@Component({
  selector: 'lm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Input() player: Player;
  @Input() players: Player[];
  @Output() emailLoginRequested = new EventEmitter<string>();

  public selectedId = '';
}
