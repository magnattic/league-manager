import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from '../players/player';
import { TableEntryFull } from './table-entry';

@Component({
  selector: 'lm-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  public sortCriteria: string;
  public sortAscending = true;

  @Input() selectedPlayer: Player;
  @Input() table: TableEntryFull[];
  @Output() selectedPlayerChanged = new EventEmitter<string>();
  @Output() sortCriteriaChanged = new EventEmitter<{ criteria: string; ascending: boolean }>();

  isHighlighted(playerName: string) {
    return this.selectedPlayer && playerName === this.selectedPlayer.name;
  }

  selectPlayer(playerName: string) {
    this.selectedPlayerChanged.emit(playerName);
  }

  sortBy(criteria: string) {
    if (criteria === 'points') {
      this.sortAscending = false;
    } else if (criteria === this.sortCriteria) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortAscending = false;
    }
    this.sortCriteria = criteria;
    this.sortCriteriaChanged.emit({ criteria, ascending: this.sortAscending });
  }
}
