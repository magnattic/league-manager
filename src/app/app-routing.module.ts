import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeagueOverviewComponent } from './league-overview/league-overview.component';

const routes: Routes = [{ path: '', component: LeagueOverviewComponent, pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
