import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FixtureEffects } from './effects/fixture.effects';
import { FixtureListComponent } from './fixture-list/fixture-list.component';
import { LeagueOverviewComponent } from './league-overview/league-overview.component';
import { metaReducers, reducers } from './reducers';
import { TableComponent } from './table/table.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [AppComponent, FixtureListComponent, TableComponent, LeagueOverviewComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFirestoreModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([FixtureEffects]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({}),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
