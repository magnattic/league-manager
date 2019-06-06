import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgrxFormsModule } from 'ngrx-forms';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthEffects } from './effects/auth.effects';
import { FixtureEffects } from './effects/fixture.effects';
import { FixtureListComponent } from './fixture-list/fixture-list.component';
import { LeagueOverviewComponent } from './league-overview/league-overview.component';
import { LoginComponent } from './login/login.component';
import { metaReducers, ROOT_REDUCERS } from './reducers';
import { CustomSerializer } from './reducers/custom-route-serializer';
import { TableComponent } from './table/table.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, FixtureListComponent, TableComponent, LeagueOverviewComponent, LoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFirestoreModule,
    StoreModule.forRoot(ROOT_REDUCERS, {
      metaReducers,
      runtimeChecks: {
        strictActionSerializability: false,
        strictStateSerializability: true,
        strictActionImmutability: true,
        strictStateImmutability: true
      }
    }),
    EffectsModule.forRoot([FixtureEffects, AuthEffects]),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomSerializer
    }),
    StoreDevtoolsModule.instrument({}),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FormsModule,
    NgrxFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
