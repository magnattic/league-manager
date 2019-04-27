import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TableCalculatorService } from '../fixtures/table-calculator.service';
import { TableEntry } from '../fixtures/table-entry';

@Component({
  selector: 'lm-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  private selectedPlayer: string;
  public sortCriteria: string;
  public sortAscending = true;

  @Input() searchTerm: string;
  @Input() table: TableEntry[];
  @Output() selectedPlayerChanged = new EventEmitter();
  @Output() sortCriteriaChanged = new EventEmitter<{ criteria: string; ascending: boolean }>();

  isHighlighted(playerName: string) {
    return playerName === this.searchTerm;
  }

  selectPlayer(playerName: string) {
    if (playerName === this.selectedPlayer) {
      this.selectedPlayer = null;
    } else {
      this.selectedPlayer = playerName;
    }
    this.selectedPlayerChanged.emit(this.selectedPlayer);
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
